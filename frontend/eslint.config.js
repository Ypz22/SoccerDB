// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
  /* =======================
     TypeScript / Angular
     ======================= */
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      /* -------- Angular -------- */
      '@angular-eslint/prefer-inject': 'off',

      /* -------- TypeScript -------- */
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-function': 'off',

      /* -------- General -------- */
      'no-console': 'off',
    },
  },

  /* =======================
     Angular Templates
     ======================= */
  {
    files: ['**/*.html'],
    extends: [
      angular.configs.templateRecommended,
    ],
    rules: {
      '@angular-eslint/template/label-has-associated-control': 'off',
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
      '@angular-eslint/template/prefer-control-flow': 'off',
    },
  },
]);
