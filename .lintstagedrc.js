// prettier-plugin-tailwindcss requires a Tailwind CSS entry point and crashes
// when run from the workspace root across non-UI packages.
// Use .prettierrc.base.json (no tailwind plugin) in the hook;
// editors use prettier.config.js (with tailwind plugin) for class sorting.
export default {
  '*.{ts,tsx,js,jsx,mjs,cjs,json,md,yml,yaml,css}': [
    'prettier --write --config .prettierrc.base.json',
  ],
}
