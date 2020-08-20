var accountNumberHandler = require('./accountNumberInputHandler');
var buyback = require('../../buyback-transactions/buyBackTransactions');

describe('account number input handler', () => {
    beforeAll(() => {
        global.state = { vars: {lang: 'en'} };
        global.service.active = false;
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should reprompt for account number once the account number is invalid', () => {
        accountNumberHandler('12345');
        expect(sayText).toHaveBeenCalledWith('Incorrect input. Please re-enter the account number (8 digits)');
    });
    it('should validate the registered account number successfully and start the buyback transation', () => {
        jest.spyOn(buyback, 'start');
        jest.spyOn(httpClient, 'request').mockReturnValueOnce({status: 200, content: JSON.stringify({accountNumber: '12000123', name: 'Adonis Lags'})});
        accountNumberHandler('12000123');
        expect(state.vars.client).toBe('{"accountNumber":"12000123","name":"Adonis Lags"}');
        expect(buyback.start).toHaveBeenCalled();

    });
});
