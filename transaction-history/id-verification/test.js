const {handlerName,getHandler} = require ('.');
const { getClient } = require('../../rw-legacy/lib/roster/api');
const getTransactionHistory= require('../get-transaction-history');


jest.mock('../../rw-legacy/lib/roster/api');
jest.mock('../get-transaction-history');

const mockClient = {
    NationalId: '9876543211234657981234'
};
getClient.mockReturnValue(mockClient);

const exampleTXHistory = [
    {
        date: '09-06-20',
        paymentID: 'xyz',
        season: '20A',
        amount: '1000',
        paidFrom: '078123456789',
        paidTo: '078987654321'
    
    },
    {
        date: '19-06-20',
        paymentID: 'abc',
        season: '20B',
        amount: '2000',
        paidFrom: '078123456789',
        paidTo: '078987654321'
    
    }
];
var getTranslator = require('../../utils/translator/translator');
var translations = require('../translations');
var translate = getTranslator(translations,'en');


describe('idVerificationHandler', () => {
    var idVerificationHandler;
    var onIdValidated;
    const account_number = '55555555';
    const country = 'wk';
    beforeEach(() => {
        getTransactionHistory.mockReset();
        sayText.mockReset();
        onIdValidated = jest.fn();
        state.vars.account = account_number;
        state.vars.country = country;
        idVerificationHandler = getHandler(onIdValidated);
        getTransactionHistory.mockReturnValueOnce(exampleTXHistory);
    });
    it('should be a function', () => {
        expect(idVerificationHandler).toBeInstanceOf(Function);
    });
    it('should get the client data with the account number', () => {
        idVerificationHandler('1234');
        expect(getClient).toHaveBeenCalledWith(account_number, country);
    });
    it('should call getTransactionHistory if input matches the last four digits on the nationalID ', () => {
        idVerificationHandler('1234');
        expect(getTransactionHistory).toHaveBeenCalled();
    });
    it('should not call getTransactionHistory if input does not match the last four digits on the nationalID ', () => {
        idVerificationHandler('4321');
        expect(getTransactionHistory).not.toHaveBeenCalled();
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
        it('should call sayText with the transactions menu', () => {
            idVerificationHandler('1234');
            expect(sayText).toBeCalledWith(
                `${translate('select_payment_detail_prompt')}`
                +`\n1. ${exampleTXHistory[0].date} - ${exampleTXHistory[0].amount} RwF`
                +`\n2. ${exampleTXHistory[1].date} - ${exampleTXHistory[1].amount} RwF`
            );            
        });
        
        it('should call sayText with the transactions menu and Kinyarwanda translation if that is the default language', () => {
            project.vars.lang = 'ki';
            idVerificationHandler('1234');
            expect(sayText).toBeCalledWith(
                `${translate('select_payment_detail_prompt', {},'ki')}`
                +`\n1. ${exampleTXHistory[0].date} - F${exampleTXHistory[0].amount}`
                +`\n2. ${exampleTXHistory[1].date} - F${exampleTXHistory[1].amount}`
            );            
        });  
        
        it('should call sayText with the transactions menu and Swahili translation if that is the default language', () => {
            project.vars.lang = 'sw';
            idVerificationHandler('1234');
            expect(sayText).toBeCalledWith(
                `${translate('select_payment_detail_prompt', {},'sw')}`
                +`\n1. ${exampleTXHistory[0].date} - KES ${exampleTXHistory[0].amount}`
                +`\n2. ${exampleTXHistory[1].date} - KES ${exampleTXHistory[1].amount}`
            );            
        }); 
        
        it('should call sayText with the transactions menu and english translation if that is the state language even if defaultlaguage is different', () => {
            project.vars.lang = 'sw';
            state.vars.lang = 'en';
            idVerificationHandler('1234');
            expect(sayText).toBeCalledWith(
                `${translate('select_payment_detail_prompt',{},'en')}`
                +`\n1. ${exampleTXHistory[0].date} - ${exampleTXHistory[0].amount} RwF`
                +`\n2. ${exampleTXHistory[1].date} - ${exampleTXHistory[1].amount} RwF`
            );      
            state.vars.lang = undefined;      
        });

        it('should call the onValidated handler if successful', () => {
            idVerificationHandler('1234');
            expect(onIdValidated).toHaveBeenCalledWith(mockClient);
        });
    });

});