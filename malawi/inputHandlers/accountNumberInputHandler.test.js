const accountNumberHandler = require('./accountNumberInputHandler');
const getClient = require('../utils/getClient');
const onAccountNumberValidated = require('../utils/onAccountNumberValidated');

jest.mock('../utils/getClient');
jest.mock('../../buyback-transactions/buyBackTransactions');
jest.mock('../utils/onAccountNumberValidated');

describe('account number input handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en-mw'} };
        global.service.active = false;
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should reprompt for account number once the account number is invalid', () => {
        getClient.mockReturnValue({error_message: 'Incorrect input. Please re-enter the account number (8 digits)'});
        accountNumberHandler.getHandler('en-mw')('12345');
        expect(sayText).toHaveBeenCalledWith('Incorrect input. Please re-enter the account number (8 digits)');
    });
    it('should validate the registered account number successfully', () => {
        getClient.mockReturnValue({
            AccountNumber: '28951336',
            ClientName: 'Ge, No',
            FirstName: 'No',
            LastName: 'Ge'});
        accountNumberHandler.getHandler('en-mw')('12000123');
        expect(onAccountNumberValidated).toHaveBeenCalledWith('en-mw', {'AccountNumber': '28951336', 'ClientName': 'Ge, No', 'FirstName': 'No', 'LastName': 'Ge'});
    });
});
