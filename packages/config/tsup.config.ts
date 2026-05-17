import { defineConfig } from 'tsup'
import { baseConfig } from '../../scripts/getTsupConfig.js'

export default defineConfig(baseConfig({ entry: ['src/index.ts'] }))
