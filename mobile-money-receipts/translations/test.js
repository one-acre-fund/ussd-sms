const getTranslations = require('./index');

describe('getTranslations', () => {
    it('should provide an english translation fron payment_receipt_ug', () => {
        const options = { firstName: 'Angello', lastTransaction: 31415, balance: 51427 };
        const expectedMessage = `Hello ${options.firstName}, You have paid OAF ${options.lastTransaction}. Your Loan Balance is now ${options.balance}. For questions, call 0800388889. Thank You!`;
        expect(getTranslations('payment_receipt_ug', options, 'en')).toEqual(expectedMessage);
    });
});
