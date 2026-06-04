import { defineConfig } from 'tsup'

// CLI build: single ESM entry with a node shebang. No dts (it's an executable,
// not a consumed library), no minify (keep stack traces readable).
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  dts: false,
  minify: false,
  banner: { js: '#!/usr/bin/env node' },
})
