var districtResponseHandler = require('./districtResponseHandler');
var acresResponseHandler = require('./acresResponseHandler');

describe('District response handler', () => {

    beforeAll(() => {
        contact.phone_number = '0555345';
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should ask the user to try again the ussd once the district is not found', () => {
        var lang = 'en-ke';
        global.content = 'district1';
        var table = {queryRows: jest.fn()};
        var row = {hasNext: jest.fn(() => false), next: jest.fn()};
        jest.spyOn(table, 'queryRows').mockReturnValue(row);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(table);
        var recommendation_table = 'dev_recommendation_table';
        var districtHandler = districtResponseHandler.getHandler(lang, recommendation_table);
        districtHandler();
        expect(sendReply).toHaveBeenCalledWith('This district does not exist, check spelling and try again *689#');
    });

    it('should prompt for acres planted per farm once the district is found', () => {
        var lang = 'en-ke';
        global.content = 'district1';
        var table = {queryRows: jest.fn()};
        var row = {hasNext: jest.fn(() => true), next: jest.fn(() => ({vars: {district: 'district1'}}))};
        jest.spyOn(table, 'queryRows').mockReturnValue(row);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(table);
        var recommendation_table = 'dev_recommendation_table';
        var districtHandler = districtResponseHandler.getHandler(lang, recommendation_table);
        districtHandler();
        expect(sendReply).toHaveBeenCalledWith( 'Last year, how many acres of maize did you plant in your farm?\n' +
        'A. 1/4 acre\n' +
        'B. 1/2 acre\n' +
        'C. 3/4 acre\n' +
        'D. 1 acre\n' +
        'E. More than 1 acre');
        expect(waitForResponse).toHaveBeenCalledWith(acresResponseHandler.handlerName);
    });
});