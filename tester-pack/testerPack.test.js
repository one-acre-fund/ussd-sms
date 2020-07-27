
var testerPack = require('./testerPack');

describe('Tester pack', () => {
    beforeAll(() => {
        global.state = { vars: {} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should start the tester pack confirmation', () => {
        testerPack.startTesterPack({lang: 'en'});
        expect(sayText).toHaveBeenCalledWith('1) Registration\n2) Confirmation\n3) Status');
        expect(promptDigits).toHaveBeenCalledWith('tester_pack_menu', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });

    it('should register all input handlers', () => {
        var confirmation = require('./confirmation/confirmTesterPackReception');
        var testerPackMenuHandler = require('./inputHandlers/testerPackMenuHandler');

        jest.spyOn(confirmation, 'registerTesterPackConfirmationHandlers');

        testerPack.registerTesterPackHandlers({lang: 'en'});

        expect(confirmation.registerTesterPackConfirmationHandlers).toBeCalledWith()
        expect(addInputHandler).toBeCalledWith('tester_pack_menu', testerPackMenuHandler);
    })
});
