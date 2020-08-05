
var testerPackMenuHandler = require('./testerPackMenuHandler');

describe('tester pack menu handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should prompt a user to choose a province once they select option (2)  for confirmation', () => {
        testerPackMenuHandler(2);
        expect(sayText).toHaveBeenCalledWith('Province\n' + 
            '1) EASTERN ZONE\n' + 
            '2) KIGALI CITY\n' +
            '3) SOUTHERN ZONE\n' +
            '4) WESTERN ZONE\n' +
            '5) NORTHERN ZONE');

        expect(promptDigits).toHaveBeenCalledWith('select_province', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });

    it('should prompt a user to choose a province again once there is no province match for their input', () => {
        testerPackMenuHandler('@');
        expect(sayText).toHaveBeenCalledWith('Invalid input try again\n' + 
            '1) Registration\n' + 
            '2) Confirmation\n' +
            '3) Status');

        expect(promptDigits).toHaveBeenCalledWith('tester_pack_menu', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });

    it('should prompt a user to enter village id once they select option (3)  for status', () => {
        testerPackMenuHandler(3);
        expect(sayText).toHaveBeenCalledWith('Enter village ID');

        expect(promptDigits).toHaveBeenCalledWith('village_id', {'maxDigits': 10, 'submitOnHash': false, 'timeout': 5});
    });

});
