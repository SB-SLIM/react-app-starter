import {
  existsSync,
  readFileSync,
  writeFileSync,
  rmSync,
  readdirSync,
} from 'node:fs'
import { join } from 'node:path'

type PkgInfo = { version: string; peerDependencies: Record<string, string> }

function readJson(path: string): Record<string, unknown> {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function writeJson(path: string, data: unknown): void {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
}

/**
 * Turn the downloaded full monorepo into an **apps-only** project:
 * - apps depend on the published `@sb-codex/*` versions (read from the template's
 *   own packages/, i.e. the current released version) instead of `workspace:^`
 * - each plugin's peerDependencies are injected into the consuming app so the
 *   project installs cleanly from npm
 * - the `packages/` source is removed; pnpm workspace + overrides are trimmed
 */
export function applyAppsOnly(targetDir: string): void {
  const packagesDir = join(targetDir, 'packages')

  // 1. Map plugin name → { version, peerDependencies } from the template packages.
  const pkgMap = new Map<string, PkgInfo>()
  if (existsSync(packagesDir)) {
    for (const entry of readdirSync(packagesDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const pj = join(packagesDir, entry.name, 'package.json')
      if (!existsSync(pj)) continue
      const pkg = readJson(pj)
      const name = pkg.name
      if (typeof name === 'string' && name.startsWith('@sb-codex/')) {
        pkgMap.set(name, {
          version: String(pkg.version ?? '0.0.0'),
          peerDependencies:
            (pkg.peerDependencies as Record<string, string>) ?? {},
        })
      }
    }
  }

  // 2. Rewrite each app: workspace:^ → published version, inject missing peers.
  const appsDir = join(targetDir, 'apps')
  if (existsSync(appsDir)) {
    for (const entry of readdirSync(appsDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const pj = join(appsDir, entry.name, 'package.json')
      if (!existsSync(pj)) continue
      const pkg = readJson(pj)
      const deps = (pkg.dependencies as Record<string, string>) ?? {}
      const devDeps = (pkg.devDependencies as Record<string, string>) ?? {}
      let changed = false

      for (const depName of Object.keys(deps)) {
        const info = pkgMap.get(depName)
        if (!info) continue
        deps[depName] = `^${info.version}`
        changed = true
        // Inject this plugin's peer deps the app doesn't already declare.
        for (const [peer, range] of Object.entries(info.peerDependencies)) {
          if (!deps[peer] && !devDeps[peer]) deps[peer] = range
        }
      }

      if (changed) {
        pkg.dependencies = deps
        writeJson(pj, pkg)
      }
    }
  }

  // 3. Remove the packages/ source entirely (includes create-sb-app itself).
  if (existsSync(packagesDir))
    rmSync(packagesDir, { recursive: true, force: true })

  // 4. pnpm-workspace.yaml → apps only.
  const wsPath = join(targetDir, 'pnpm-workspace.yaml')
  if (existsSync(wsPath)) {
    const kept = readFileSync(wsPath, 'utf8')
      .split(/\r?\n/)
      .filter((line) => !/['"]packages\/\*['"]/.test(line))
      .join('\n')
    writeFileSync(wsPath, kept)
  }

  // 5. Strip @sb-codex/* from root pnpm.overrides (they come from npm now).
  const rootPj = join(targetDir, 'package.json')
  if (existsSync(rootPj)) {
    const pkg = readJson(rootPj)
    const pnpm = pkg.pnpm as { overrides?: Record<string, string> } | undefined
    if (pnpm?.overrides) {
      for (const key of Object.keys(pnpm.overrides)) {
        if (key.startsWith('@sb-codex/')) delete pnpm.overrides[key]
      }
    }
    writeJson(rootPj, pkg)
  }

  // 6. Drop changeset config — the new project consumes plugins, doesn't publish them.
  const changesetDir = join(targetDir, '.changeset')
  if (existsSync(changesetDir))
    rmSync(changesetDir, { recursive: true, force: true })

  // 7. Drop starter-specific meta files (not relevant to a forked project).
  for (const rel of ['.claude', 'CLAUDE.md', 'docs']) {
    const p = join(targetDir, rel)
    if (existsSync(p)) rmSync(p, { recursive: true, force: true })
  }
}
