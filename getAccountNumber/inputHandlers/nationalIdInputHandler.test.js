const nationalInputHandler = require('./nationalIdInputHandler');
const getAccountNumber = require('../../shared/rosterApi/checkAccountNumberByNID');

jest.mock('../../shared/rosterApi/checkAccountNumberByNID');
describe('national id input handler', () => {
    it('should reprompt if the api returns no client', () => {
        getAccountNumber.mockReturnValueOnce(null);
        const handler = nationalInputHandler.getHandler('en');
        handler();
        expect(sayText).toHaveBeenCalledWith('Enter your national id');
        expect(promptDigits).toHaveBeenCalledWith(nationalInputHandler.handlerName);
    });
    it('should display account number', () => {
        const client = {FirstName: 'Tyrion', LastName: 'Lanyster', AccountNumber: '12423234'}
        getAccountNumber.mockReturnValueOnce(client);
        const handler = nationalInputHandler.getHandler('en');
        handler();
        expect(sayText).toHaveBeenCalledWith('Tyrion Lanyster, your Account Number is 12423234');
        expect(stopRules).toHaveBeenCalled();
    });
});
