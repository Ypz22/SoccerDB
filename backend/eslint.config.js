const js = require('@eslint/js');

module.exports = [
    {
        files: ['src/**/*.js'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'commonjs',
            globals: {
                process: 'readonly',
                module: 'readonly',
                require: 'readonly'
            }
        },
        rules: {
            ...js.configs.recommended.rules,
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            'no-mixed-spaces-and-tabs': ['warn'],
            'no-unused-vars': ['warn'],
            'no-console': ['warn'],
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all'],
            'no-var': ['error'],
            'prefer-const': ['error']
        }
    }
];
