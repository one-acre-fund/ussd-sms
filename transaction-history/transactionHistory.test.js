var nidVerification = require('./id-verification/idVerification');
var transactionView = require('./display-transactions/displayTransactions');
var getTransactionHistory = require('./get-transaction-history/getTransactionHistory');
var selectionHandler = require('./selection-hander/on-select');


jest.mock('./id-verification/idVerification');
jest.mock('./display-transactions/displayTransactions');
jest.mock('./get-transaction-history/getTransactionHistory');
jest.mock('./selection-hander/on-select');

const transactionHistory = require('./transactionHistory');

const mockIdVerificationHandler = jest.fn();
const mockSelectionHandler = jest.fn();

var mockTransactions = [
    {
        'RepaymentId': '2534504906',
        'RepaymentDate': '20/05/2020 20:27:03',
        'Season': '2020',
        'Amount': 2001,
    },    
    {
        'RepaymentId': '2474515444',
        'RepaymentDate': '05/05/2020 16:16:56',
        'Season': '2020',
        'Amount': 2002,
        'PaidFrom': '0787428878'
    },
    {
        'RepaymentId': '2285699969',
        'RepaymentDate': '04/03/2020 20:29:54',
        'Season': '2020',
        'Amount': 2003,
        'PaidFrom': '663565'
    },
    {
        'RepaymentId': '2233627731',
        'RepaymentDate': '11/02/2020 21:11:39',
        'Season': '2020',
        'Amount': 2004,
        'PaidFrom': '788926'
    },
    {
        'RepaymentId': '2219628297',
        'RepaymentDate': '05/02/2020 19:36:25',
        'Season': '2020',
        'Amount': 2005,
        'PaidFrom': '594206'
    },
];

getTransactionHistory.mockReturnValue(mockTransactions);
const account = 123456789;
const country = 'UG';
describe('TransactionHistory', () => {
    it('should have a start function', () => {
        expect(transactionHistory.start ).toBeInstanceOf(Function);
    });
    describe('registerHandlers', () => {
        beforeEach(() => {
            nidVerification.getHandler.mockClear();
            nidVerification.getHandler.mockReturnValue(mockIdVerificationHandler);
            selectionHandler.getHandler.mockReturnValue(mockSelectionHandler);
        });
        it('should add IdVerificationhandler to input handlers', () => {
            transactionHistory.registerHandlers();
            expect(addInputHandler).toHaveBeenCalledWith(nidVerification.handlerName, nidVerification.getHandler());            
        });
        it('should get the niDVerification handler using the account number and country', () => {
            transactionHistory.registerHandlers();
            expect( nidVerification.getHandler).toHaveBeenCalledWith(expect.any(Function));
        });
        it('should add selectionhandler to inputHandlers', () => {
            transactionHistory.registerHandlers();
            expect(addInputHandler).toHaveBeenCalledWith(selectionHandler.handlerName, selectionHandler.getHandler());             
        });
        it('should add the backTolisthandler to inputHandlers', () => {            
            transactionHistory.registerHandlers();
            expect(addInputHandler).toHaveBeenCalledWith(transactionHistory.backToListHandlerName, expect.any(Function));  
        });
        describe('BackToList handler', () => {
            let handler;
            beforeEach(() => {         
                transactionHistory.registerHandlers();
                handler = addInputHandler.mock.calls[2][1];
                state.vars.transactionHistory = JSON.stringify([{some: 'trasactions'}]);
                state.vars.thPage = 5;
            });
            it('should call transactionview.list with transactions from the state object and  the page', () => {
                handler('anything');
                expect(transactionView.list).toHaveBeenLastCalledWith(
                    JSON.parse(state.vars.transactionHistory),
                    state.vars.thPage
                );
            });
            it('should prompt the user to select ', () => {
                handler('anything');
                expect(global.promptDigits).toHaveBeenCalledWith(selectionHandler.handlerName);
            });
        });
        
        describe('Id Verification success callback', () => {
            var callback;
            beforeEach(() => {
                transactionHistory.registerHandlers();
                callback = nidVerification.getHandler.mock.calls[0][0];                
            });
            it('should list the transactions from getTransactions ', () => {
                callback();
                expect(transactionView.list).toHaveBeenCalled();
                expect(transactionView.list.mock.calls[0][0]).toEqual(mockTransactions);
            });
            it('should prompt for the client to select a transaction ', () => {
                callback();
                expect(promptDigits).toHaveBeenCalledWith(selectionHandler.handlerName);
            });
        });
        describe('Selection Callback', () => {
            var callback;
            beforeEach(() => {
                transactionView.list.mockClear();
                transactionHistory.registerHandlers();
                const onVerified = nidVerification.getHandler.mock.calls[0][0];
                onVerified();
                callback = selectionHandler.getHandler.mock.calls[0][0];   
            });
            it('should show the selected transaction', () => {
                mockTransactions.forEach((tx,index)=>{
                    callback(`${index+1}`);
                    expect(transactionView.show).toHaveBeenLastCalledWith(tx, transactionHistory.backToListHandlerName);
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
            it('should show an error message if the user selects an out of range option', () => {
                callback(`${mockTransactions.length +3}`);
                const errorMessage = 'Invalid selection, please try again.\n';
                expect(transactionView.list).toHaveBeenLastCalledWith(mockTransactions, 1, errorMessage);
            });
            it('should show an error message if the user input is invalid', () => {
                callback('x');
                const errorMessage = 'Invalid selection, please try again.\n';
                expect(transactionView.list).toHaveBeenLastCalledWith(mockTransactions, 1, errorMessage);
            });
            it('should prompt the client to enter make another selection if the first was invalid', () => {
                promptDigits.mockClear();                
                callback(`${mockTransactions.length +3}`);
                expect(promptDigits).toHaveBeenLastCalledWith(selectionHandler.handlerName);
            });
        });
    });
    describe('start', () => {
        it('should set the  state vars to the provided account and country', () => {
            state.vars.account = '';
            state.vars.country = '';
            transactionHistory.start(account, country);
            expect(state.vars).toMatchObject({account,country});
        });
        it('should prompt for the last four digits of the national id', () => {
            transactionHistory.start(account, country);
            expect(sayText).toHaveBeenCalledWith('Please enter the last four digits of the national ID you registered with.');
        });
        it('should call prompt digits with "last_four_nid_handler"', () => {
            transactionHistory.start(account, country);
            expect(promptDigits).toHaveBeenCalledWith(nidVerification.handlerName);
        });
    });
});