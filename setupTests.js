var underscore = require('underscore');
global._= underscore;
global.sendMessage = jest.fn();
global.addInputHandler = jest.fn();
global.PhoneNumber = {
    formatInternationalRaw: jest.fn()
};
global.moment  = require('moment');

global.project = {
    name: 'mock-project-name',
    vars: {
        new_line: '~B',
        lang: 'en',
        cor_lang: 'en',
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
global.call = {
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
global.waitForResponse = jest.fn();
global.content = null;
global.sendReply = jest.fn();
project.initServiceById = jest.fn();
project.scheduleMessage = jest.fn();
global.playAudio = jest.fn();
global.promptKey = jest.fn();
global.hangUp = jest.fn();