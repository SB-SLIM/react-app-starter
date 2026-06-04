/**
 * Project-specific tokens hardcoded in the starter, and how to replace them
 * when scaffolding a new project. This is the single source of truth for
 * "what is specific to the sb-codex reference project".
 */

export type Answers = {
  /** New project name (kebab-case). */
  name: string
  /** Production domain, replaces the reference domain. */
  domain: string
}

export type Replacement = { find: RegExp; replace: string }

const NOTION_PAGE_ID_DASHED = /3741c921-e61d-815f-8b78-e896fe1b65f3/g
const NOTION_PAGE_ID_COMPACT = /3741c921e61d815f8b78e896fe1b65f3/g

export function buildReplacements(answers: Answers): Replacement[] {
  const { name, domain } = answers
  return [
    // Production domain (hub.<domain>, hub-dev.<domain>, …)
    { find: /slimbouchoucha\.tn/g, replace: domain },
    // GHCR image prefix — owner unknown at scaffold time, leave a placeholder
    {
      find: /ghcr\.io\/sb-slim\/react-app-starter/gi,
      replace: `ghcr.io/your-gh-org/${name}`,
    },
    // GitHub repo references
    {
      find: /SB-SLIM\/react-app-starter/g,
      replace: `your-gh-org/${name}`,
    },
    // Remaining bare repo name (URLs, image names)
    { find: /react-app-starter/g, replace: name },
    // VPS IP
    { find: /152\.53\.187\.54/g, replace: 'YOUR_VPS_IP' },
    // Notion page id (mirror of architecture docs — project specific)
    { find: NOTION_PAGE_ID_DASHED, replace: 'YOUR_NOTION_PAGE_ID' },
    { find: NOTION_PAGE_ID_COMPACT, replace: 'YOUR_NOTION_PAGE_ID' },
  ]
}

/** File extensions whose text content is scanned for replacements. */
export const TEXT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.yml',
  '.yaml',
  '.css',
  '.html',
  '.example',
  '.env',
])

/** Directories never walked during the replacement pass. */
export const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  '.turbo',
  '.next',
  'build',
])
