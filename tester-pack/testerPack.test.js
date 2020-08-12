
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
        expect(state.vars.lang).toBe('en');
        expect(sayText).toHaveBeenCalledWith('1) Registration\n2) Confirmation\n3) Status');
        expect(promptDigits).toHaveBeenCalledWith('tester_pack_menu', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });

    it('should register all input handlers', () => {
        var confirmation = require('./confirmation/confirmTesterPackReception');
        var status = require('./status/status');
        var testerPackMenuHandler = require('./inputHandlers/testerPackMenuHandler');

        jest.spyOn(confirmation, 'registerTesterPackConfirmationHandlers');
        jest.spyOn(status, 'registerTesterPackStatusHandlers');

        testerPack.registerTesterPackHandlers({lang: 'en'});

        expect(state.vars.lang).toBe('en');
        expect(confirmation.registerTesterPackConfirmationHandlers).toBeCalled();
        expect(status.registerTesterPackStatusHandlers).toBeCalled();
        expect(addInputHandler).toBeCalledWith('tester_pack_menu', testerPackMenuHandler);
    });
});
