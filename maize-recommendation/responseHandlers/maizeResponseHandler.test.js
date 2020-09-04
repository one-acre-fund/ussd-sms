var maizeResponseHandler = require('./maizeResponseHandler');
var seasonHandler = require('./seasonHandler');

describe('Maize response handler', () => {

    beforeAll(() => {
        contact.phone_number = '0555345';
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should reprompt for the maize bags once the input is invalid', () => {
        var lang = 'en-ke';
        state.vars.acres_message = 'Last year, how many bags of maize did you harvest in that plot (long rains)?\n' +
        'A. less than 7 bags\n' +
        'B. Between 7 - 10 bags\n' +
        'C. More than 10';
        global.content = 'N';
        var maizeBagsHandler = maizeResponseHandler.getHandler(lang);
        maizeBagsHandler();
        expect(sendReply).toHaveBeenCalledWith(state.vars.acres_message);
        expect(waitForResponse).toHaveBeenCalledWith(maizeResponseHandler.handlerName);
    });

    it('should send a low productivity recommendation message once user chooses A', () => {
        var lang = 'en-ke';
        global.content = 'a';
        var table = {queryRows: jest.fn()};
        var row = {hasNext: jest.fn(() => true), next: jest.fn(() => ({vars: {low_productivity: 'low_productivity'}}))};
        jest.spyOn(table, 'queryRows').mockReturnValue(row);
        jest.spyOn(project, 'getOrCreateDataTable').mockReturnValue(table);
        var recommendation_table = 'dev_recommendation_table';
        var maizeBagsHandler = maizeResponseHandler.getHandler(lang, recommendation_table);
        maizeBagsHandler();
        expect(sendReply).toHaveBeenCalledWith('low_productivity');
    });

    it('should prompt for the season comfirmation once the user chooses b', () => {
        var lang = 'en-ke';
        global.content = 'b';
        var maizeBagsHandler = maizeResponseHandler.getHandler(lang);
        maizeBagsHandler();
        expect(sendReply).toHaveBeenCalledWith('Did you plant maize right after the rains started last year?\n' + 
        'A. Yes\n' +
        'B. No');
        expect(waitForResponse).toHaveBeenCalledWith(seasonHandler.handlerName);
    });

    it('should prompt for the season comfirmation once the user chooses c', () => {
        var lang = 'en-ke';
        global.content = 'c';
        var maizeBagsHandler = maizeResponseHandler.getHandler(lang);
        maizeBagsHandler();
        expect(sendReply).toHaveBeenCalledWith('Did you plant maize right after the rains started last year?\n' + 
        'A. Yes\n' +
        'B. No');
        expect(waitForResponse).toHaveBeenCalledWith(seasonHandler.handlerName);
    });
});