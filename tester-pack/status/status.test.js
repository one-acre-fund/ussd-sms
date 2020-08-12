
var testerPackStatus = require('./status');

describe('Tester pack Status checking', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should prompt for village id once tester pack status starts ', () => {
        testerPackStatus.startTesterPackStatus();
        expect(sayText).toHaveBeenCalledWith('Enter village ID');
        expect(promptDigits).toHaveBeenCalledWith('village_id', {'maxDigits': 10, 'submitOnHash': false, 'timeout': 5});
    });

    it('should register all input handlers', () => {
        var status = require('./status');

        var villageIdHandler = require('./inputHandlers/villageIdHandler');
        var registeredConfirmedHandler = require('./inputHandlers/registeredConfirmedHandler');
        var nextScreenHandler = require('./inputHandlers/nextScreensHandler');

        status.registerTesterPackStatusHandlers();

        expect(addInputHandler).toBeCalledWith('village_id', villageIdHandler);
        expect(addInputHandler).toBeCalledWith('registered_confirmed', registeredConfirmedHandler);
        expect(addInputHandler).toBeCalledWith('next_farmers_list', nextScreenHandler);
    });
});
