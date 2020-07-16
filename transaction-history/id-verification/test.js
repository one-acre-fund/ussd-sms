const {handlerName,getHandler} = require ('.');
const { getClient } = require('../../rw-legacy/lib/roster/api');


jest.mock('../../rw-legacy/lib/roster/api');
jest.mock('../get-transaction-history/getTransactionHistory');

const mockClient = {
    NationalId: '9876543211234657981234'
};
getClient.mockReturnValue(mockClient);


describe('idVerificationHandler', () => {
    var idVerificationHandler;
    var onIdValidated;
    const account_number = '55555555';
    const country = 'wk';
    beforeEach(() => {
        sayText.mockReset();
        onIdValidated = jest.fn();
        state.vars.account = account_number;
        state.vars.country = country;
        idVerificationHandler = getHandler(onIdValidated);
    });
    it('should be a function', () => {
        expect(idVerificationHandler).toBeInstanceOf(Function);
    });
    it('should get the client data with the account number', () => {
        idVerificationHandler('1234');
        expect(getClient).toHaveBeenCalledWith(account_number, country);
    });
    it('should show prompt message for retry if input does not match the last for digits of the NID', () => {
        project.vars.lang = 'en';
        idVerificationHandler('4321');
        expect(sayText).toHaveBeenCalledWith('You\'ve incorrectly entered the last four digits of your national ID. Please try again.');
    });
    it('should call promptDigits for the correct last four digits of nid', () => {
        idVerificationHandler('4321');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
    describe('Withtransactionhistory', () => {
        beforeEach(() => {
            getClient.mockReturnValueOnce(mockClient);
        });

        it('should call the onValidated handler if successful', () => {
            idVerificationHandler('1234');
            expect(onIdValidated).toHaveBeenCalledWith(mockClient);
        });
    });

});