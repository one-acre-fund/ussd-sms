module.exports = {
    'env': {
        'commonjs': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 5
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'key-spacing': [
            'error'
        ]
    },
    'globals': {
        contact: 'readonly',
        sendMessage: 'readonly'
    },
    'overrides': [
        {
            'files': ['**/*test.js'],
            'env': {
                jest: true
            },
            'parserOptions': {
                'ecmaVersion': 6
            },
        }
    ]
};
