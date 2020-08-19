var accountNumberHandler = require('./accountNumberInputHandler');
var getClient = require('../utils/getClient');
var buybackTransactions =  require('../../buyback-transactions/buyBackTransactions');

jest.mock('../utils/getClient');
jest.mock('../../buyback-transactions/buyBackTransactions');

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
        accountNumberHandler('12345');
        expect(sayText).toHaveBeenCalledWith('Incorrect input. Please re-enter the account number (8 digits)');
    });
    it('should validate the registered account number successfully', () => {
        getClient.mockReturnValue({client: {accountNumber: '12000123', name: 'Adonis Lags'}});
        accountNumberHandler('12000123');
        expect(buybackTransactions.start).toHaveBeenCalled();
    });
});
