var nidVerification = require('./id-verification');
var transactionView = require('./list-transactions');
var getTransactionHistory = require('./get-transaction-history');
var selectionHandler = require('./selection-hander/on-select');


jest.mock('./id-verification');
jest.mock('./list-transactions');
jest.mock('./get-transaction-history');
jest.mock('./selection-hander/on-select');

const transactionHistory = require('.');
const idVerification = require('./id-verification');

const mockIdVerificationHandler = jest.fn();
const mockSelectionHandler = jest.fn();

var mockTransactions = [
    {
        'Payment': 'ID ABC',
        'RepaymentDate': '11-06-20',
        'Season': '21A',
        'Amount': '1000',
        'PaidFrom': '0789193399',
    },
    {
        'Payment': 'ID DEF',
        'RepaymentDate': '10-06-20',
        'Season': '21A',
        'Amount': '2000',
        'PaidFrom': '0789193399',
    },
    {
        'Payment': 'ID GHI',
        'RepaymentDate': '09-06-20',
        'Season': '21A',
        'Amount': '3000',
        'PaidFrom': '0789193399',
    },
    {
        'Payment': 'ID JKL',
        'RepaymentDate': '08-06-20',
        'Season': '21A',
        'Amount': '1000',
        'PaidFrom': '0789193399',
    },
    {
        'Payment': 'ID MNO',
        'RepaymentDate': '07-06-20',
        'Season': '21A',
        'Amount': '2000',
        'PaidFrom': '0789193399',
    },
    {
        'Payment': 'ID PQR',
        'RepaymentDate': '06-06-20',
        'Season': '21A',
        'Amount': '3000',
        'PaidFrom': '0789193399',
    },
];

getTransactionHistory.mockReturnValue(mockTransactions);
const account = 123456789;
const country = 'UG';
describe('TransactionHistory', () => {
    it('should have a start function', () => {
        expect(transactionHistory.start ).toBeInstanceOf(Function);
    });
    describe('start', () => {
        beforeEach(() => {
            nidVerification.getHandler.mockClear();
            nidVerification.getHandler.mockReturnValue(mockIdVerificationHandler);
            selectionHandler.getHandler.mockReturnValue(mockSelectionHandler);
        });
        it('should add IdVerificationhandler to input handlers', () => {
            transactionHistory.start(account, country);
            expect(addInputHandler).toHaveBeenCalledWith(nidVerification.handlerName, nidVerification.getHandler());            
        });
        it('should get the niDVerification handler using the account number and country', () => {
            transactionHistory.start(account, country);
            expect( nidVerification.getHandler).toHaveBeenCalledWith(account,country, expect.any(Function));
        });
        it('should call prompt digits with "last_four_nid_handler"', () => {
            transactionHistory.start(account, country);
            expect(promptDigits).toHaveBeenCalledWith(idVerification.handlerName);
        });
        it('should add selectionhandler to inputHandlers', () => {
            transactionHistory.start(account, country);
            expect(addInputHandler).toHaveBeenCalledWith(selectionHandler.handlerName, selectionHandler.getHandler());             
        });
        describe('Id Verification success callback', () => {
            var callback;
            beforeEach(() => {
                transactionHistory.start(account, country);
                callback = nidVerification.getHandler.mock.calls[0][2];                
            });
            it('should lists the transactions from getTransactions ', () => {
                callback();
                expect(transactionView.list).toHaveBeenCalledWith(mockTransactions);
            });
            it('should prompt for the client to select a transaction ', () => {
                callback();
                expect(promptDigits).toHaveBeenCalledWith(selectionHandler.handlerName);
            });
        });
        describe('Selection Callback', () => {
            var callback;
            beforeEach(() => {
                transactionHistory.start(account, country);
                const onVerified = nidVerification.getHandler.mock.calls[0][2];
                onVerified();
                callback = selectionHandler.getHandler.mock.calls[0][0];   
            });
            it('should show the selected transaction', () => {
                mockTransactions.forEach((tx,index)=>{
                    callback(`${index+1}`);
                    expect(transactionView.show).toHaveBeenLastCalledWith(tx);
                });
            });
            it('should show the next page when 99 is entered  ', () => {
                callback('99');
                expect(transactionView.list).toHaveBeenLastCalledWith(mockTransactions, 2);
                callback('99');
                expect(transactionView.list).toHaveBeenLastCalledWith(mockTransactions, 3);
            });
            it('should not show individual transaction if 99 is entered ', () => {
                transactionView.show.mockClear();
                callback('99');
                expect(transactionView.show).not.toHaveBeenCalled();
            });
            it('should prompt for the user to make another selection if the user navigates to the next page', () => {
                promptDigits.mockClear();
                callback('99');
                expect(promptDigits).toHaveBeenCalledWith(selectionHandler.handlerName);           
            });
            
            it('should not prompt for the user to make another selection if the user navigates to transaction detail view', () => {
                promptDigits.mockClear();                
                mockTransactions.forEach((tx,index)=>{ 
                    callback(`${index+1}`);
                });
                expect(promptDigits).not.toHaveBeenCalledWith(selectionHandler.handlerName);           
            });
        });
    });
});