var acresResponseHandler = require('./acresResponseHandler');
var maizeResponseHandler = require('./maizeResponseHandler');

describe('acres response handler', () => {

    beforeAll(() => {
        contact.phone_number = '0555345';
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should ask the user to try again once the input is invalid', () => {
        var lang = 'en-ke';
        state.vars.acres_message = 'Last year, how many acres of maize did you plant in your farm?\n' +
        'A. 1/4 acre\n' +
        'B. 1/2 acre\n' +
        'C. 3/4 acre\n' +
        'D. 1 acre\n' +
        'E. More than 1 acre';
        global.content = 'K';
        var acresHandler = acresResponseHandler.getHandler(lang);
        acresHandler();
        expect(sendReply).toHaveBeenCalledWith(state.vars.acres_message);
        expect(waitForResponse).toHaveBeenCalledWith(acresResponseHandler.handlerName);
    });

    it('should ask for bags of maize once the input is A', () => {
        var lang = 'en-ke';
        global.content = 'A';
        var acresHandler = acresResponseHandler.getHandler(lang);
        acresHandler();
        expect(sendReply).toHaveBeenCalledWith('Last year, how many bags of maize did you harvest in that plot (long rains)?\n' +
        'A. less than 4 bags\n' +
        'B. Between 4 - 5 bags\n' +
        'C. More than 5');
        expect(waitForResponse).toHaveBeenCalledWith(maizeResponseHandler.handlerName);
    });

    it('should ask for bags of maize once the input is B', () => {
        var lang = 'en-ke';
        global.content = 'B';
        var acresHandler = acresResponseHandler.getHandler(lang);
        acresHandler();
        expect(sendReply).toHaveBeenCalledWith('Last year, how many bags of maize did you harvest in that plot (long rains)?\n' +
        'A. less than 7 bags\n' +
        'B. Between 7 - 10 bags\n' +
        'C. More than 10');
        expect(waitForResponse).toHaveBeenCalledWith(maizeResponseHandler.handlerName);
    });

    it('should ask for bags of maize once the input is B', () => {
        var lang = 'en-ke';
        global.content = 'C';
        var acresHandler = acresResponseHandler.getHandler(lang);
        acresHandler();
        expect(sendReply).toHaveBeenCalledWith('Last year, how many bags of maize did you harvest in that plot (long rains)?\n' +
        'A. less than 11 bags\n' +
        'B. Between 12 - 15 bags\n' +
        'C. More than 15');
        expect(waitForResponse).toHaveBeenCalledWith(maizeResponseHandler.handlerName);
    });

    it('should ask for bags of maize per acre once the input is D', () => {
        var lang = 'en-ke';
        global.content = 'D';
        var acresHandler = acresResponseHandler.getHandler(lang);
        acresHandler();
        expect(sendReply).toHaveBeenCalledWith('Last year, how many bags of maize PER ACRE did you harvest in that plot?\n' +
        'A. less than 13 bags\n' +
        'B. Between 14 - 20 bags\n' +
        'C. More than 21');
        expect(waitForResponse).toHaveBeenCalledWith(maizeResponseHandler.handlerName);
    });

    it('should ask for bags of maize per acre once the input is E', () => {
        var lang = 'en-ke';
        global.content = 'D';
        var acresHandler = acresResponseHandler.getHandler(lang);
        acresHandler();
        expect(sendReply).toHaveBeenCalledWith('Last year, how many bags of maize PER ACRE did you harvest in that plot?\n' +
        'A. less than 13 bags\n' +
        'B. Between 14 - 20 bags\n' +
        'C. More than 21');
        expect(waitForResponse).toHaveBeenCalledWith(maizeResponseHandler.handlerName);
    });
});