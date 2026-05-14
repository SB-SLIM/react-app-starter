import { defineConfig } from 'tsup'
import { baseConfig } from '../../scripts/getTsupConfig';

export default defineConfig(
    baseConfig({ entry: ['src/index.ts'] })
);