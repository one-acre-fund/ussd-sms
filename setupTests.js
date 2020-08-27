var underscore = require('underscore');
global._= underscore;
global.sendMessage = jest.fn();
global.addInputHandler = jest.fn();
global.project = {
    name: 'mock-project-name',
    vars: {
        new_line: '~B',
        lang: 'en',
        console_lang: 'en',
        elk_logs_base_url: 'https://example.logs.io'
    },
    getOrCreateDataTable: jest.fn(),
    sendMulti: jest.fn()
};
global.httpClient = jest.fn();
global.state = {
    vars: {
    }
};
global.sayText = jest.fn();
global.promptDigits = jest.fn();

global.afterEach(function() {
    jest.clearAllMocks();
});
global.httpClient = {
    request: jest.fn()
};
global.stopRules = jest.fn();

global.service = {
    name: 'mock-service-name',
    phone_number: {},
    vars: {
        env: 'dev'
    }
};

global.contact = {
    vars: {
    }
};
global.message = {
    vars: {
    }
};
project.initDataTableById = jest.fn();
global.stopRules = jest.fn();
global.project.getOrCreateLabel = jest.fn();

global.project.sendMessage = jest.fn();
global.sendEmail = jest.fn();
project.getOrCreateDataTable = jest.fn();
