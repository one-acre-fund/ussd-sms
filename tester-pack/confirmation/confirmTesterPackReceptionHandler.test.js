
var confirmTesterPackReception = require('./confirmTesterPackReception');

describe('tester pack menu handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should handle the right choice', () => {
        confirmTesterPackReception.startTesterPackConfirmation();
        expect(sayText).toHaveBeenCalledWith('Province\n' + 
            '1) EASTERN ZONE\n' + 
            '2) KIGALI CITY\n' +
            '3) SOUTHERN ZONE\n' +
            '4) WESTERN ZONE\n' +
            '5) NORTHERN ZONE');

        expect(promptDigits).toHaveBeenCalledWith('select_province', {'maxDigits': 2, 'submitOnHash': false, 'timeout': 5});
    });

    it('should register input handlers', () => {
        var provinceHandler = require('./inputHandlers/provinceHandler');
        var districtHandler = require('./inputHandlers/districtsHandler');
        var sectorHandler = require('./inputHandlers/sectorsHandler');
        var cellHandler = require('./inputHandlers/cellHandler');
        var villageHandler = require('./inputHandlers/villageHandler');
        var farmerHandler = require('./inputHandlers/farmerHandler');
        var lastFourIdDigitsHandler = require('./inputHandlers/lastfourNidDigitsHandler');
        var receptionHandler = require('./inputHandlers/receptionHandler');
        
        confirmTesterPackReception.registerTesterPackConfirmationHandlers()

        expect(addInputHandler).toHaveBeenCalledWith('select_province',provinceHandler);
        expect(addInputHandler).toHaveBeenCalledWith('select_district',districtHandler);
        expect(addInputHandler).toHaveBeenCalledWith('select_sector',sectorHandler);
        expect(addInputHandler).toHaveBeenCalledWith('select_cell',cellHandler);
        expect(addInputHandler).toHaveBeenCalledWith('select_village',villageHandler);
        expect(addInputHandler).toHaveBeenCalledWith('select_farmer',farmerHandler);
        expect(addInputHandler).toHaveBeenCalledWith('last_four_nid_digits',lastFourIdDigitsHandler);
        expect(addInputHandler).toHaveBeenCalledWith('confirm_reception',receptionHandler);
    });

});
