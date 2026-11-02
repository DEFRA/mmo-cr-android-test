import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import { configs as wdioConfig } from 'eslint-plugin-wdio';
import tseslint from 'typescript-eslint';

export default defineConfig([
    {
        ignores: ['allure-results/', 'allure-report/', 'docker/'],
    },

    js.configs.recommended,

    {
        files: ['**/*.ts'],
        extends: [tseslint.configs.strictTypeChecked, wdioConfig['flat/recommended']],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
    },

    {
        files: ['**/*.{js,ts}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.mocha,
            },
        },
        plugins: {
            prettier: eslintPluginPrettier,
        },
        rules: {
            'prettier/prettier': 'error',
            'no-console': 'error',
            'no-unused-vars': 'off',
        },
    },

    {
        files: ['**/*.js'],
        rules: {
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
    },

    eslintConfigPrettier,
]);
