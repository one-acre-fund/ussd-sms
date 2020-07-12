global.sendMessage = jest.fn();
global.addInputHandler = jest.fn();
global.project = {
    vars: {
        new_line: '~B',
        lang: 'en',
        console_lang: 'en'
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
<<<<<<< HEAD
global.stopRules = jest.fn();
=======

>>>>>>> origin/develop
global.service = {
    vars: {
    }
};
<<<<<<< HEAD
global.project.initDataTableById = jest.fn();
=======

global.contact = {
    vars: {
    }
};

global.stopRules = jest.fn();
>>>>>>> origin/develop
