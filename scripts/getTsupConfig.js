// @ts-check

const legacyTargets = ['es2023', 'es2020', 'node16']
const modernTargets = ['chrome91', 'firefox90', 'edge91', 'safari15', 'ios15', 'opera77']

/**
 * @param {Object} opts - Options for building configurations.
 * @param {string[]} opts.entry - The entry array.
 * @returns {import('tsup').Options}
 */
export function baseConfig(opts) {
  return {
    entry: opts.entry,
    format: ['cjs', 'esm'],
    target: [...legacyTargets, ...modernTargets],
    outDir: 'dist/',
    dts: true,
    sourcemap: true,
    clean: true,
    splitting: false,
    minify: true,
  }
}



