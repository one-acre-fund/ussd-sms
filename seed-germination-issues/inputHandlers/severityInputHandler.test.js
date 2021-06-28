const phoneNumberInputHandler = require('./phoneNumberInputHandler');
const severityInputHandler = require('./severityInputHandler');

describe('issue severity', () => {
    it('should reprompt for severity if the user enters an invalid input', () => {
        var handler = severityInputHandler.getHandler('en-ke');
        handler('9');
        expect(sayText).toHaveBeenCalledWith('What is the severity of the germination issue?\n' +
        '1. Low (0-25% crops did not germinate)' +
        '2. Medium(26-50%  crops did not germinate)\n' +
        '3. High(51-75% crops did not germinate)\n' +
        '4. Very high(76-100% crops did not germinate)');
        expect(promptDigits).toHaveBeenCalledWith(severityInputHandler.handlerName);
    });

    it('should prompt for phone if the input is valid (1-4)', () => {
        var handler = severityInputHandler.getHandler('en-ke');
        handler('2');
        expect(state.vars.issues_severity);
        expect(sayText).toHaveBeenCalledWith('Please provide your phone number so we can follow up with you');
        expect(promptDigits).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName);
    });
});