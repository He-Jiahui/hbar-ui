// Note: To debug stylelint config resolution for a specific file, use
//         pnpm exec stylelint --print-config <path-to-file>

/** @type {import('stylelint').Config} */
export default {
  extends: '@mui/internal-code-infra/stylelint',
  overrides: [
    {
      files: ['**/*.module.css'],
      rules: {
        // CSS Modules uses these scoping markers before emitting browser CSS.
        'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local'] }],
      },
    },
    {
      files: [
        'docs/data/material/integrations/interoperability/**/*.js',
        'docs/data/material/integrations/interoperability/**/*.tsx',
      ],
      rules: {
        'nesting-selector-no-missing-scoping-root': null,
      },
    },
  ],
};
