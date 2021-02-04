var quantityHandler = require('./quantity-handler/quantityHandler');
var dateAvailableHandler = require('./date-available-handler/dateAvailableHandler');
var confirmationHandler = require('./confirmation-handler/confirmationHandler');
var paymentAdvanceHandler = require('./payment-advance-handler/paymentAdvanceHandler');
var paymentChoiceHandler = require('./payment-choice-handler/paymentChoiceHandler');
var MOMOHandler = require('./MOMO-handler/MOMOHandler');
var phoneNumberHandler = require('./phone-number-handler/phoneNumberHandler');
var nameHandler = require('./name-handler/nameHandler');
var bankNameHandler = require('./bank-input-handlers/bank-name-handler/bankNameHandler');
var bankBranchHandler = require('./bank-input-handlers/bank-branch-handler/bankBranchHandler');
var bankAccountHandler = require('./bank-input-handlers/bank-account-handler/bankAccountHandler');
var accountNameHandler = require('./bank-input-handlers/account-name-handler/accountNameHandler');
var nationalIdHandler = require('./non-client-handlers/national-id-handler/nationalIDHandler');
var farmerNamesHandler = require('./non-client-handlers/farmer-names-handler/farmerNamesHandler');
var farmerDistrictHandler = require('./non-client-handlers/farmer-district-handler/farmerDistrictHandler');
var farmerSiteHandler = require('./non-client-handlers/farmer-site-handler/farmerSiteHandler');
const {client}  = require('../chicken-services/test-client-data');
var marketAccess = require('./marketAccess');
var notifyELK = require('../notifications/elk-notification/elkNotification');

jest.mock('./quantity-handler/quantityHandler');
jest.mock('./date-available-handler/dateAvailableHandler');
jest.mock('./confirmation-handler/confirmationHandler');
jest.mock('./payment-advance-handler/paymentAdvanceHandler');
jest.mock('./payment-choice-handler/paymentChoiceHandler');
jest.mock('./MOMO-handler/MOMOHandler');
jest.mock('../notifications/elk-notification/elkNotification');


jest.mock('./phone-number-handler/phoneNumberHandler');
jest.mock('./name-handler/nameHandler');
jest.mock('./bank-input-handlers/bank-name-handler/bankNameHandler');
jest.mock('./bank-input-handlers/bank-branch-handler/bankBranchHandler');
jest.mock('./bank-input-handlers/bank-account-handler/bankAccountHandler');
jest.mock('./bank-input-handlers/account-name-handler/accountNameHandler');

jest.mock('./non-client-handlers/national-id-handler/nationalIDHandler');
jest.mock('./non-client-handlers/farmer-names-handler/farmerNamesHandler');
jest.mock('./non-client-handlers/farmer-district-handler/farmerDistrictHandler');
jest.mock('./non-client-handlers/farmer-site-handler/farmerSiteHandler');

const mockQuantityHandler  = jest.fn();
const mockDateAvailableHandler = jest.fn();
const mockConfirmationHandler = jest.fn();
const mockPaymentAdvanceHandler = jest.fn();
const mockPaymentChoiceHandler = jest.fn();
const mockMOMOHandler = jest.fn();

const mockPhoneNumberHandler = jest.fn();
const mockNameHandler = jest.fn();
const mockBankNameHandler = jest.fn();
const mockBankBranchHandler = jest.fn();
const mockBankAccountHandler = jest.fn();
const mockAccountNameHandler = jest.fn();

const mocknationalIdHandler = jest.fn();
const mockfarmerNamesHandler = jest.fn();
const mockfarmerDistrictHandler = jest.fn();
const mockfarmerSiteHandler = jest.fn();

var account = client.AccountNumber;
var country = 'RW';
var marketLang = 'en';
var callback;
describe('marketAccess', () => {
    beforeAll(()=>{
        const mockTable = { queryRows: jest.fn(), createRow: jest.fn() };
        var mockRow = {save: jest.fn(), vars: { }};
        var mockCursor = { hasNext: jest.fn(), next: jest.fn()};
        project.initDataTableById.mockReturnValue(mockTable);
        mockTable.queryRows.mockReturnValue(mockCursor);
        mockCursor.hasNext.mockReturnValue(true);
        mockCursor.next.mockReturnValue(mockRow);
        mockTable.createRow.mockReturnValue(mockRow);
        state.vars.marketInfo = JSON.stringify({account: client.AccountNumber});
    });
    
    beforeEach(() => {
        quantityHandler.getHandler.mockReturnValue(mockQuantityHandler);
        dateAvailableHandler.getHandler.mockReturnValue(mockDateAvailableHandler);
        confirmationHandler.getHandler.mockReturnValue(mockConfirmationHandler);
        paymentAdvanceHandler.getHandler.mockReturnValue(mockPaymentAdvanceHandler);
        paymentChoiceHandler.getHandler.mockReturnValue(mockPaymentChoiceHandler);
        MOMOHandler.getHandler.mockReturnValue(mockMOMOHandler);
        phoneNumberHandler.getHandler.mockReturnValue(mockPhoneNumberHandler);
        nameHandler.getHandler.mockReturnValue(mockNameHandler);
        bankNameHandler.getHandler.mockReturnValue(mockBankNameHandler);
        bankBranchHandler.getHandler.mockReturnValue(mockBankBranchHandler);
        bankAccountHandler.getHandler.mockReturnValue(mockBankAccountHandler);
        accountNameHandler.getHandler.mockReturnValue(mockAccountNameHandler);

        nationalIdHandler.getHandler.mockReturnValue(mocknationalIdHandler);
        farmerNamesHandler.getHandler.mockReturnValue(mockfarmerNamesHandler);
        farmerDistrictHandler.getHandler.mockReturnValue(mockfarmerDistrictHandler);
        farmerSiteHandler.getHandler.mockReturnValue(mockfarmerSiteHandler);
    });
    it('should have a start function', () => {
        expect(marketAccess.start).toBeInstanceOf(Function);
    });
    it('should add the quantity handler to input handlers', () => {
        marketAccess.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(quantityHandler.handlerName, quantityHandler.getHandler());            
    });
    it('should add the data availability handler to input handlers', () => {
        marketAccess.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(dateAvailableHandler.handlerName, dateAvailableHandler.getHandler());            
    });
    it('should add the confirmation handler to input handlers', () => {
        marketAccess.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(confirmationHandler.handlerName, confirmationHandler.getHandler());            
    });
    it('should add the advance payment  handler to input handlers', () => {
        marketAccess.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(paymentAdvanceHandler.handlerName, paymentAdvanceHandler.getHandler());            
    });
    it('should add the MOMO handler to input handlers', () => {
        marketAccess.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(MOMOHandler.handlerName, MOMOHandler.getHandler());            
    });
    it('should add the phoneNumber handler to input handlers', () => {
        marketAccess.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(phoneNumberHandler.handlerName, phoneNumberHandler.getHandler());            
    });
    it('should add the name handler to the input handlers', () => {
        marketAccess.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(nameHandler.handlerName, nameHandler.getHandler());            
    });
    it('should add the bankName handler to input handlers', () => {
        marketAccess.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(bankNameHandler.handlerName, bankNameHandler.getHandler());            
    });
    it('should add the bankBranch handler to input handlers', () => {
        marketAccess.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(bankBranchHandler.handlerName, bankBranchHandler.getHandler());            
    });
    it('should add the bankAccount handler to input handlers', () => {
        marketAccess.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(bankAccountHandler.handlerName, bankAccountHandler.getHandler());            
    });
    it('should add the accountName handler to input handlers', () => {
        marketAccess.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(accountNameHandler.handlerName, accountNameHandler.getHandler());            
    }); 

    it('should add the nationalID handler to input handlers', () => {
        marketAccess.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(nationalIdHandler.handlerName, nationalIdHandler.getHandler());            
    }); 
    it('should add the farmerNames handler to input handlers', () => {
        marketAccess.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(farmerNamesHandler.handlerName, farmerNamesHandler.getHandler());            
    }); 
    it('should add the farmerDistrict handler to input handlers', () => {
        marketAccess.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(farmerDistrictHandler.handlerName, farmerDistrictHandler.getHandler());            
    }); 
    it('should add the farmerSite handler to input handlers', () => {
        marketAccess.registerHandlers();
        expect(addInputHandler).toHaveBeenCalledWith(farmerSiteHandler.handlerName, farmerSiteHandler.getHandler());            
    }); 
    describe('start', ()=>{
        var mockRow = {save: jest.fn(), vars: { }};
        var mockCursor = { hasNext: jest.fn(), next: jest.fn()};
        beforeEach(()=>{
            const mockTable = { queryRows: jest.fn(), createRow: jest.fn()};
            project.initDataTableById.mockReturnValue(mockTable);
            mockTable.queryRows.mockReturnValue(mockCursor);
            mockCursor.hasNext.mockReturnValue(true);
            mockCursor.next.mockReturnValue(mockRow);
        }); 
        var date = '21/04/2021';
        var quantity = 100;
        it('should set the state variables',()=>{
            state.vars.account = '';
            state.vars.country = '';
            state.vars.marketLang = '';
            marketAccess.start(client, country, marketLang);
            expect(state.vars).toMatchObject({account,country,marketLang});
        });
        it('should call notify ELK',()=>{
            marketAccess.start(client, country, marketLang);
            expect(notifyELK).toHaveBeenCalled();
        });
        it('should display the menu with when the client ordered if they have finalized',()=>{
            mockRow.vars = {'account': client.AccountNumber, 'finalized': 1, AvailabilityDate: date, QuantityofMaize: quantity };
            mockCursor.next.mockReturnValue(mockRow);
            marketAccess.start(client, country, marketLang);
            expect(global.sayText).toHaveBeenCalledWith(`This farmer already commited to sell  ${quantity}`+
            ` kgs of unshelled maize on ${date}.`);
        });
        it('should display the menu the prevoius session ended with and prompt for input if they have not yet finalized but started the process',()=>{
            mockRow.vars = {'account': client.AccountNumber, 'finalized': 0, AvailabilityDate: date, QuantityofMaize: quantity, currentCallback: 'onPhoneSubmitted', currentCallBackInput: 1234};
            mockCursor.hasNext.mockReturnValueOnce(false).mockReturnValue(true);
            mockCursor.next.mockReturnValue(mockRow);
            marketAccess.start(client, country, marketLang);
            expect(global.sayText).toHaveBeenCalledWith('Enter the name of person the number is registered to');
            expect(promptDigits).toHaveBeenCalledWith(nameHandler.handlerName);
        });
        it('should display the quantity menu if it\'s the first time the client access the service',()=>{
            mockRow.vars = {'account': client.AccountNumber};
            mockCursor.hasNext.mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValue(true);
            mockCursor.next.mockReturnValue(mockRow);
            marketAccess.start(client, country, marketLang);
            expect(global.sayText).toHaveBeenCalledWith('Quantity of Unshelled Maize (Kgs)');
            expect(promptDigits).toHaveBeenCalledWith(quantityHandler.handlerName);
        });
    });
    describe('quantity handler successful callback', ()=>{ 
        beforeEach(() => {
            marketAccess.registerHandlers();
            callback = quantityHandler.getHandler.mock.calls[0][0];                
        });
        it('should prompt for the date',()=>{
            callback();
            expect(global.sayText).toHaveBeenCalledWith('When  Maize will be available (Enter dd/mm/yyyy)');
            expect(global.promptDigits).toHaveBeenCalledWith(dateAvailableHandler.handlerName);
        });
    });
    describe('date availability handler successful callback', ()=>{ 
        beforeEach(() => {
            marketAccess.registerHandlers();
            callback = dateAvailableHandler.getHandler.mock.calls[0][0];                
        });
        it('should prompt for date confirmation',()=>{
            callback('11/11/2021');
            expect(global.sayText).toHaveBeenCalledWith('You are committing to sell undefined kgs of unshielded maize on 11/11/2021 . Enter 0 to confirm');
            expect(global.promptDigits).toHaveBeenCalledWith(confirmationHandler.handlerName);
        });
    });
    describe('Confirmation handler successful callback', ()=>{ 
        beforeEach(() => {
            marketAccess.registerHandlers();
            callback = confirmationHandler.getHandler.mock.calls[0][0];                
        });
        it('should prompt for  payment advance input if the client confirms the date',()=>{
            callback('0');
            expect(global.sayText).toHaveBeenCalledWith('Do you want an Advance payment for your maize? \n1)Yes\n2)No');
            expect(global.promptDigits).toHaveBeenCalledWith(paymentAdvanceHandler.handlerName);
        });
        it('should re-prompt for date confirmation if the user did not confirm the date',()=>{
            callback('2');
            expect(global.sayText).toHaveBeenCalledWith('You are committing to sell undefined kgs of unshielded maize on 11/11/2021 . Enter 0 to confirm');
            expect(global.promptDigits).toHaveBeenCalledWith(confirmationHandler.handlerName);
        });
    });
    describe('Advance Payment successful callback', ()=>{ 
        beforeEach(() => {
            marketAccess.registerHandlers();
            callback = paymentAdvanceHandler.getHandler.mock.calls[0][0];                
        });
        it('should prompt for  payment advance input if the client confirms the date',()=>{
            callback(1);
            expect(global.sayText).toHaveBeenCalledWith('How would the farmer like to receive your advance payment?\n1) Mobile Money\n2)Bank Account\n3) Back');
            expect(global.promptDigits).toHaveBeenCalledWith(paymentChoiceHandler.handlerName);
        });
    });
    describe(' Payment choice successful callback', ()=>{ 
        beforeEach(() => {
            marketAccess.registerHandlers();
            callback = paymentChoiceHandler.getHandler.mock.calls[0][0];                
        });
        it('should prompt for MOMO choice input if the client confirms using momo(input == 1)',()=>{
            callback(1);
            expect(global.sayText).toHaveBeenCalledWith('what is Mobile Money company\n1)MTN\n2)Airtel or Tigo\n3)Back');
            expect(global.promptDigits).toHaveBeenCalledWith(MOMOHandler.handlerName);
        });
        it('should prompt for Bank choice if the client confirms using bank(input ==2)',()=>{
            callback(2);
            expect(global.sayText).toHaveBeenCalledWith('Enter Bank Name');
        });
        it('should go back to the previous menu if the client press go back(input ==3)',()=>{
            callback(3);
            expect(global.sayText).toHaveBeenCalledWith('Do you want an Advance payment for your maize? \n1)Yes\n2)No');
            expect(global.promptDigits).toHaveBeenCalledWith(paymentAdvanceHandler.handlerName);
        });
    });
    describe('MOMO handler successful callback', ()=>{
        beforeEach(() => {
            marketAccess.registerHandlers();
            callback = MOMOHandler.getHandler.mock.calls[0][0];                
        });
        it('should prompt for the client\'s phone number if the client confirms MTN',()=>{
            callback(1);
            expect(global.sayText).toHaveBeenCalledWith('Enter Client  Mobile Money Number');
            expect(promptDigits).toHaveBeenCalledWith(phoneNumberHandler.handlerName);
        });
        it('should prompt for the client\'s phone number if the client confirms TIGO',()=>{
            callback(2);
            expect(global.sayText).toHaveBeenCalledWith('Enter Client  Mobile Money Number');
            expect(promptDigits).toHaveBeenCalledWith(phoneNumberHandler.handlerName);
        });
    });



    describe('phoneNumber handler successful callback', ()=>{
        beforeEach(() => {
            marketAccess.registerHandlers();
            callback = phoneNumberHandler.getHandler.mock.calls[0][0];                
        });
        it('should prompt for the name registered on the phone',()=>{
            callback('0786980987');
            expect(global.sayText).toHaveBeenCalledWith('Enter the name of person the number is registered to');
            expect(promptDigits).toHaveBeenCalledWith(nameHandler.handlerName);
        });
    });
    describe('name handler successful callback', ()=>{
        var phone = '0786235698'; 
        var name = 'client name';
        beforeEach(() => {
            marketAccess.registerHandlers();
            callback = nameHandler.getHandler.mock.calls[0][0];  
                       
        });
        it('should display the name and phone where the advance will be sent and send an sms',()=>{
            state.vars.marketInfo = JSON.stringify({account: client.AccountNumber, AdvancePhoneNumber: phone});
            callback(name);
            expect(global.sayText).toHaveBeenCalledWith(`The Farmer advance will be sent to ${name}`+
            `  with number ${phone}`);
            expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({'content': `The Farmer advance will be sent to ${name}`+
            `  with number ${phone}`}));
        });
    });

    describe('bankName handler successful callback', ()=>{
        beforeEach(() => {
            marketAccess.registerHandlers();
            callback = bankNameHandler.getHandler.mock.calls[0][0];                
        });
        it('should prompt for the branch name when the bank name callback is called',()=>{
            callback('bank name');
            expect(global.sayText).toHaveBeenCalledWith('Enter Bank Branch');
            expect(promptDigits).toHaveBeenCalledWith(bankBranchHandler.handlerName);
        });
    });

    describe('bankBranch handler successful callback', ()=>{
        beforeEach(() => {
            marketAccess.registerHandlers();
            callback = bankBranchHandler.getHandler.mock.calls[0][0];                
        });
        it('should prompt for the bank account when the bank branch callback is called',()=>{
            callback('bank branch name');
            expect(global.sayText).toHaveBeenCalledWith('Enter Farmer Bank Account Number');
            expect(promptDigits).toHaveBeenCalledWith(bankAccountHandler.handlerName);
        });
    });
    describe('bankAccount handler successful callback', ()=>{
        beforeEach(() => {
            marketAccess.registerHandlers();
            callback = bankAccountHandler.getHandler.mock.calls[0][0];                
        });
        it('should prompt for the bank account name when the bank account callback is called',()=>{
            callback('bank branch name');
            expect(global.sayText).toHaveBeenCalledWith('Enter Farmer\'s Account Name');
            expect(promptDigits).toHaveBeenCalledWith(accountNameHandler.handlerName);
        });
    });

    describe('accountName handler successful callback', ()=>{
        var clientBankAccountNumber = '444-444';
        var bankName = 'BK';
        var bankClientName = 'clientName';
        beforeEach(() => {
            marketAccess.registerHandlers();
            callback = accountNameHandler.getHandler.mock.calls[0][0];        
        });
        it('should display the ',()=>{
            state.vars.marketInfo = JSON.stringify({account: client.AccountNumber, ClientAccountName: bankClientName, BankName: bankName, ClientBankAccountNumber: clientBankAccountNumber});
            callback(bankClientName);
            expect(global.sayText).toHaveBeenCalledWith(`The Client's advance will be sent to  Account Number ${clientBankAccountNumber}`+
            `, ${bankClientName}`+
            ` in Bank: ${bankName} `);
            expect(project.sendMessage).toHaveBeenCalledWith(expect.objectContaining({'content': `The Client's advance will be sent to  Account Number ${clientBankAccountNumber}`+
            `, ${bankClientName}`+
            ` in Bank: ${bankName} `}));
        });
    });

    describe('farmer names handler successful callback', ()=>{
        beforeEach(() => {
            marketAccess.registerHandlers();
            callback = farmerNamesHandler.getHandler.mock.calls[0][0];                
        });
        it('should prompt for the district name when the farmer name callback is called',()=>{
            callback('Farmer Name');
            expect(global.sayText).toHaveBeenCalledWith('Enter the farmer\'s district');
            expect(promptDigits).toHaveBeenCalledWith(farmerDistrictHandler.handlerName);
        });
    });
    describe('farmer district handler successful callback', ()=>{
        beforeEach(() => {
            marketAccess.registerHandlers();
            callback = farmerDistrictHandler.getHandler.mock.calls[0][0];                
        });
        it('should prompt for the site name when the farmer district callback is called',()=>{
            callback('District Name');
            expect(global.sayText).toHaveBeenCalledWith('Enter the farmer\'s site');
            expect(promptDigits).toHaveBeenCalledWith(farmerSiteHandler.handlerName);
        });
    });
    describe('farmer site handler successful callback', ()=>{
        beforeEach(() => {
            marketAccess.registerHandlers();
            callback = farmerSiteHandler.getHandler.mock.calls[0][0];                
        });
        it('should prompt for the maize quantity when the farmer site callback is called',()=>{
            callback('site Name');
            expect(global.sayText).toHaveBeenCalledWith('Quantity of Unshelled Maize (Kgs)');
            expect(promptDigits).toHaveBeenCalledWith(quantityHandler.handlerName);
        });
    });

});


describe('national ID callback', ()=>{
    var mockRow = {save: jest.fn(), vars: { }};
    var mockCursor = { hasNext: jest.fn(), next: jest.fn()};
    var nationalID = 1234;
    beforeEach(()=>{
        const mockTable = { queryRows: jest.fn(), createRow: jest.fn()};
        project.initDataTableById.mockReturnValue(mockTable);
        mockTable.queryRows.mockReturnValue(mockCursor);
        mockCursor.hasNext.mockReturnValue(true);
        mockCursor.next.mockReturnValue(mockRow);
        marketAccess.registerHandlers();
        callback = nationalIdHandler.getHandler.mock.calls[0][0];  
    }); 
    var date = '21/04/2021';
    var quantity = 100;
    it('should display the menu with when the client ordered if they have finalized',()=>{
        mockRow.vars = {'nationalId': nationalID, 'finalized': 1, AvailabilityDate: date, QuantityofMaize: quantity };
        mockCursor.next.mockReturnValue(mockRow);
        callback(nationalID);
        expect(global.sayText).toHaveBeenCalledWith(`This farmer already commited to sell  ${quantity}`+
        ` kgs of unshelled maize on ${date}.`);
    });
    it('should display the menu the previous session ended with and prompt for input if they have not yet finalized but started the process',()=>{
        mockRow.vars = {'nationalID': nationalID, 'finalized': 0, AvailabilityDate: date, QuantityofMaize: quantity, currentCallback: 'onPhoneSubmitted', currentCallBackInput: 1234};
        mockCursor.hasNext.mockReturnValueOnce(false).mockReturnValue(true);
        mockCursor.next.mockReturnValue(mockRow);
        callback(nationalID);
        expect(global.sayText).toHaveBeenCalledWith('Enter the name of person the number is registered to');
        expect(promptDigits).toHaveBeenCalledWith(nameHandler.handlerName);
    });
    it('should display the enter farmer name menu if it\'s the first time the client access the service',()=>{
        mockRow.vars = {'nationalID': nationalID};
        mockCursor.hasNext.mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValue(true);
        mockCursor.next.mockReturnValue(mockRow);
        callback(345);
        expect(global.sayText).toHaveBeenCalledWith('Enter the farmer\'s names');
        expect(promptDigits).toHaveBeenCalledWith(farmerNamesHandler.handlerName);
    });
});


describe('nonClientStart', ()=>{
    var nonClient = 'true';
    it('should set the state variables',()=>{
        state.vars.nonClient = '';
        state.vars.country = '';
        state.vars.marketLang = '';
        marketAccess.nonClientStart(country, marketLang);
        expect(state.vars).toMatchObject({nonClient,country,marketLang});
    });
    it('should call notify ELK',()=>{
        marketAccess.nonClientStart(country, marketLang);
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should prompt for the national ID',()=>{
        marketAccess.nonClientStart(country, marketLang);
        expect(global.sayText).toHaveBeenCalledWith('Enter Farmer\'s national ID');
        expect(promptDigits).toHaveBeenCalledWith(nationalIdHandler.handlerName);

    });
});