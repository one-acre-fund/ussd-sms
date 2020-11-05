const weekInputHandler = require('./weekInputHandler');
const phoneNumberInputHandler = require('./phoneNumberInputHandler');

describe('week input handler', () => {
    it('should reprompt for the week once the user enters anything other than 1, 2, 3 or 4', () => {
        state.vars.chosen_month = 'January';
        const handler = weekInputHandler.getHandler('en-ke');
        handler('5');
        expect(sayText).toHaveBeenCalledWith('In which week of January did you plant?\n' +
        '1) First week of January\n' +
        '2) Second week of January\n' +
        '3) Third week of January\n' +
        '4) Fourth week of January');
        expect(promptDigits).toHaveBeenCalledWith(weekInputHandler.handlerName);
    });

    it('should prompt for phone number once the user enters a valid week number', () => {
        const handler = weekInputHandler.getHandler('en-ke');
        handler('1');
        expect(state.vars.week_number).toEqual('1');
        expect(sayText).toHaveBeenCalledWith('Please provide your phone number so we can follow up with you');
        expect(promptDigits).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName);
    });
});
