import eslint from '@eslint/js';
import astro from 'eslint-plugin-astro';
import sonarjs from 'eslint-plugin-sonarjs';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.astro/**',
      '.vercel/**',
      '.cursor/Contest/**',
      '.cursor/hooks/**',
      'public/fonts/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    plugins: { sonarjs },
    rules: {
      'max-depth': ['error', 3],
      'max-lines-per-function': ['error', { max: 20, skipBlankLines: true, skipComments: true }],
      complexity: ['error', 10],
      'max-params': ['error', 4],
      'max-nested-callbacks': ['error', 3],
      '@typescript-eslint/no-explicit-any': 'error',
      'sonarjs/no-duplicate-string': ['warn', { threshold: 5 }],
      'sonarjs/no-identical-functions': 'warn',
      'sonarjs/cognitive-complexity': ['error', 15],
    },
  },
];
