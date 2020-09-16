module.exports = {
    'env': {
        'commonjs': true,
        'jest': true
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
    'globals': { // these are  telerivet global variables
        contact: 'readonly',
        sendMessage: 'readonly',
        curssor: 'readonly',
        cursor: 'readonly',
        moment: 'readonly',
        console: 'readonly',
        state: 'readonly',
        call: 'readonly',
        promptDigits: 'readonly',
        sayText: 'readonly',
        '_': 'readonly',
        service: 'readonly',
        project: 'readonly',
        addInputHandler: 'readonly',
        hangUp: 'readonly',
        stopRules: 'readonly',
        httpClient: 'readonly',
        sendEmail: 'readonly',
        PhoneNumber: 'readonly',
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
