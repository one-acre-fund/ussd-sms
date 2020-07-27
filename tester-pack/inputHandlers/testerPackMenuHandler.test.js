
var testerPackMenuHandler = require('./testerPackMenuHandler');

describe('tester pack menu handler', () => {
    beforeAll(() => {
        global.state = { vars: {} };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should handle the right choice', () => {
        testerPackMenuHandler(2);
        expect(sayText).toHaveBeenCalledWith('Province\n' + 
            '1) EASTERN ZONE\n' + 
            '2) KIGALI CITY\n' +
            '3) SOUTHERN ZONE\n' +
            '4) WESTERN ZONE\n' +
            '5) NORTHERN ZONE');

        expect(promptDigits).toHaveBeenCalledWith('select_province', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });

});
