var idVerificationHandler = require('./id-verification');
const transactionHistory = require('.');

describe('TransactionHistory', () => {
    it('should have a start function', () => {
        expect(transactionHistory.start ).toBeInstanceOf(Function);
    });
    describe('start', () => {
        it('should add IdVerificationhandler to input handlers', () => {
            transactionHistory.start();
            expect(addInputHandler).toHaveBeenCalledWith('last_four_nid_handler', idVerificationHandler);            
        });
        it('should call prompt digits with "last_four_nid_handler"', () => {
            transactionHistory.start();
            expect(promptDigits).toHaveBeenCalledWith('last_four_nid_handler');
        });
    });
});