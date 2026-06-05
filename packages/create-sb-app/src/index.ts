import {
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  copyFileSync,
} from 'node:fs'
import { join, extname } from 'node:path'
import { execSync } from 'node:child_process'
import {
  intro,
  outro,
  text,
  confirm,
  spinner,
  isCancel,
  cancel,
  note,
} from '@clack/prompts'
import { downloadTemplate } from 'giget'
import pc from 'picocolors'
import {
  buildReplacements,
  TEXT_EXTENSIONS,
  SKIP_DIRS,
  type Answers,
} from './replacements'
import { applyAppsOnly } from './transform'

const TEMPLATE = 'github:SB-SLIM/react-app-starter'

function bail(message: string): never {
  cancel(message)
  process.exit(1)
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Parse `--key value` / `--key=value` / `--flag` from argv. */
function parseFlags(argv: string[]): Record<string, string | boolean> {
  const flags: Record<string, string | boolean> = {}
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (!arg || !arg.startsWith('--')) continue
    const eq = arg.indexOf('=')
    if (eq !== -1) {
      flags[arg.slice(2, eq)] = arg.slice(eq + 1)
    } else {
      const key = arg.slice(2)
      const next = argv[i + 1]
      if (next && !next.startsWith('--')) {
        flags[key] = next
        i++
      } else {
        flags[key] = true
      }
    }
  }
  return flags
}

/** Recursively collect text files under dir, skipping SKIP_DIRS. */
function collectTextFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      collectTextFiles(join(dir, entry.name), acc)
    } else if (entry.isFile()) {
      const name = entry.name
      if (TEXT_EXTENSIONS.has(extname(name)) || name.startsWith('.env')) {
        acc.push(join(dir, name))
      }
    }
  }
  return acc
}

async function main() {
  console.log()
  intro(pc.bgCyan(pc.black(' create-sb-app ')))

  const flags = parseFlags(process.argv.slice(2))
  const positional = process.argv.slice(2).find((a) => !a.startsWith('--'))

  // Project name = directory name (single source of truth, like create-vite).
  // Positional arg or --name skips the prompt; otherwise ask once.
  let target =
    positional ?? (typeof flags.name === 'string' ? flags.name : undefined)
  if (!target) {
    const answer = await text({
      message: 'Project name?',
      placeholder: 'my-saas',
      validate: (v) => (slugify(v).length === 0 ? 'Invalid name' : undefined),
    })
    if (isCancel(answer)) bail('Cancelled.')
    target = answer
  }

  // The folder and the package name are always the same value.
  const name = slugify(target)
  const targetDir = join(process.cwd(), target)
  if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
    bail(`Directory "${target}" already exists and is not empty.`)
  }

  // Production domain (--domain or prompt)
  let domain: string
  if (typeof flags.domain === 'string') {
    domain = flags.domain
  } else {
    const domainAnswer = await text({
      message: 'Production domain? (defaults to localhost for local dev)',
      placeholder: 'localhost',
      defaultValue: 'localhost',
    })
    if (isCancel(domainAnswer)) bail('Cancelled.')
    domain = domainAnswer || 'localhost'
  }

  // git init (--git / --no-git, or prompt)
  let doGit: boolean
  if (flags.git === true || flags['no-git'] === true) {
    doGit = flags.git === true
  } else {
    const gitAnswer = await confirm({ message: 'Initialize a fresh git repo?' })
    if (isCancel(gitAnswer)) bail('Cancelled.')
    doGit = gitAnswer
  }

  const answers: Answers = {
    name: slugify(name),
    domain: domain.trim(),
  }

  // 1. Download the full monorepo template (apps + packages, workspace:^)
  const s = spinner()
  s.start('Downloading template')
  try {
    await downloadTemplate(TEMPLATE, { dir: targetDir, forceClean: true })
  } catch (err) {
    s.stop('Download failed')
    bail(err instanceof Error ? err.message : String(err))
  }
  s.stop('Template downloaded')

  // 2. Apps-only transform: apps depend on the published @sb-codex/* versions
  //    (+ their peer deps); the packages/ source is removed.
  applyAppsOnly(targetDir)
  // giget ships a tarball (no .git), but be safe
  const gitDir = join(targetDir, '.git')
  if (existsSync(gitDir)) rmSync(gitDir, { recursive: true, force: true })
  // Drop the starter's lockfile so the new project resolves a fresh one.
  const lockfile = join(targetDir, 'pnpm-lock.yaml')
  if (existsSync(lockfile)) rmSync(lockfile, { force: true })

  // 3. Replacement pass
  s.start('Personalizing project')
  const replacements = buildReplacements(answers)
  for (const file of collectTextFiles(targetDir)) {
    let content = readFileSync(file, 'utf8')
    let changed = false
    for (const { find, replace } of replacements) {
      if (find.test(content)) {
        content = content.replace(find, replace)
        changed = true
      }
    }
    if (changed) writeFileSync(file, content)
  }

  // Root package.json name
  const rootPkgPath = join(targetDir, 'package.json')
  if (existsSync(rootPkgPath)) {
    const pkg = JSON.parse(readFileSync(rootPkgPath, 'utf8'))
    pkg.name = answers.name
    writeFileSync(rootPkgPath, JSON.stringify(pkg, null, 2) + '\n')
  }

  // .env from .env.example
  const envExample = join(targetDir, '.env.example')
  const envFile = join(targetDir, '.env')
  if (existsSync(envExample) && !existsSync(envFile)) {
    copyFileSync(envExample, envFile)
  }
  s.stop('Project personalized')

  // 4. Optional git init
  if (doGit) {
    try {
      execSync('git init', { cwd: targetDir, stdio: 'ignore' })
      execSync('git add -A', { cwd: targetDir, stdio: 'ignore' })
    } catch {
      // non-fatal
    }
  }

  // 5. Present the architecture of the generated project
  note(
    [
      pc.bold('apps/'),
      '  admin    React 19 + Vite + Tailwind v4 + TanStack Router/Query',
      '  server   Fastify 5 + tRPC v11 + Pino (stateless API)',
      '  web      Next.js 15 marketing site',
      '  e2e      Playwright',
      pc.bold('@sb-codex/* plugins (from npm)'),
      '  core · config · db · auth · api-contracts · jobs · ui-components',
      pc.bold('infra/'),
      '  docker · compose · traefik',
      '',
      pc.dim('Multi-tenant: Postgres + RLS, x-workspace-slug header.'),
      pc.dim('Plugins resolved from npm — no packages/ folder.'),
    ].join('\n'),
    'Architecture',
  )

  note(
    [
      `cd ${target}`,
      'pnpm install',
      '# .env already created from .env.example — fill the secrets',
      'pnpm dev',
    ].join('\n'),
    'Next steps',
  )

  outro(pc.green(`Created ${pc.bold(answers.name)} 🎉`))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
