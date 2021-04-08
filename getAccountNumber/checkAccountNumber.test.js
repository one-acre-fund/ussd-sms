const checkAccountNumber = require('./checkAccountNumber');
const nationalIdInputHandler = require('./inputHandlers/nationalIdInputHandler');

jest.mock('./inputHandlers/nationalIdInputHandler');
describe('check account number', () => {
    it('should prompt for the national id once it start', () => {
        checkAccountNumber.start('en', 645);
        expect(sayText).toHaveBeenCalledWith('Enter your national id');
        expect(promptDigits).toHaveBeenCalledWith(nationalIdInputHandler.handlerName);
        expect(state.vars.countryId).toEqual(645);
    });

    it('should register national id input handler', () => {
        const mockHandler = jest.fn();
        jest.spyOn(nationalIdInputHandler, 'getHandler').mockReturnValueOnce(mockHandler);
        checkAccountNumber.registerInputHandlers('en');
        expect(addInputHandler).toHaveBeenCalledWith(nationalIdInputHandler.handlerName, mockHandler);
        expect(nationalIdInputHandler.getHandler).toHaveBeenCalledWith('en');
    });
});