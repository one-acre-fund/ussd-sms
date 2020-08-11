
var testerPackRegistration = require('./testerPackRegistration');

describe('Tester pack', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should start the tester pack registration and prompt for village id', () => {
        testerPackRegistration.startTesterPackRegistration();
        expect(state.vars.lang).toBe('en');
        expect(sayText).toHaveBeenCalledWith('Welcome Farmer Promoter. Enter your village ID');
        expect(promptDigits).toHaveBeenCalledWith('fp_enter_id', {'maxDigits': 8, 'submitOnHash': false, 'timeout': 180});
    });
});
