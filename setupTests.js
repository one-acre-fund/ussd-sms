global.sendMessage = jest.fn();
global.addInputHandler = jest.fn();
global.project = {
    vars: {
        new_line: '~B',
        lang: 'en',
        console_lang: 'en'
    }
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

