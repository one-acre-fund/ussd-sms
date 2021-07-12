const plantingDateInputHandler = require('./plantingDateInputHandler');
const severityInputHandler = require('./severityInputHandler');

describe('planting date input handler', () => {
    it('should reprompt for the date if the input is not a valid date', () => {
        const handler = plantingDateInputHandler.getHandler('en-ke');
        handler('5');
        expect(sayText).toHaveBeenCalledWith('When did you plant the seeds? Include date, Month and year. (dd/mm/yyyy)');
        expect(promptDigits).toHaveBeenCalledWith(plantingDateInputHandler.handlerName);
    });

    it('should prompt prompt for a severity level if client enters a valid date', () => {
        const handler = plantingDateInputHandler.getHandler('en-ke');
        handler('26/01/2021');
        expect(state.vars.planting_date).toEqual('26/01/2021');
        expect(sayText).toHaveBeenCalledWith('What is the severity of the germination issue?\n' +
        '1. Low (0-25% crops did not germinate)' +
        '2. Medium(26-50%  crops did not germinate)\n' +
        '3. High(51-75% crops did not germinate)\n' +
        '4. Very high(76-100% crops did not germinate)');
        expect(promptDigits).toHaveBeenCalledWith(severityInputHandler.handlerName);
    });
});
