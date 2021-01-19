var quantityHandler = require('./quantity-handler/quantityHandler');
var dateAvailableHandler = require('./date-available-handler/dateAvailableHandler');
var confirmationHandler = require('./confirmation-handler/confirmationHandler');
var paymentAdvanceHandler = require('./payment-advance-handler/paymentAdvanceHandler');
var paymentChoiceHandler = require('./payment-choice-handler/paymentChoiceHandler');
var MOMOHandler = require('./MOMO-handler/MOMOHandler');

var marketAccess = require('./marketAccess');
var notifyELK = require('../notifications/elk-notification/elkNotification');

jest.mock('./quantity-handler/quantityHandler');
jest.mock('./date-available-handler/dateAvailableHandler');
jest.mock('./confirmation-handler/confirmationHandler');
jest.mock('./payment-advance-handler/paymentAdvanceHandler');
jest.mock('./payment-choice-handler/paymentChoiceHandler');
jest.mock('./MOMO-handler/MOMOHandler');
jest.mock('../notifications/elk-notification/elkNotification');



const mockQuantityHandler  = jest.fn();
const mockDateAvailableHandler = jest.fn();
const mockConfirmationHandler = jest.fn();
const mockPaymentAdvanceHandler = jest.fn();
const mockPaymentChoiceHandler = jest.fn();
const mockMOMOHandler = jest.fn();

var account = '250542023';
var country = 'RW';
var marketLang = 'en';
var callback;
describe('marketAccess', () => {
    
    beforeEach(() => {
        quantityHandler.getHandler.mockReturnValue(mockQuantityHandler);
        dateAvailableHandler.getHandler.mockReturnValue(mockDateAvailableHandler);
        confirmationHandler.getHandler.mockReturnValue(mockConfirmationHandler);
        paymentAdvanceHandler.getHandler.mockReturnValue(mockPaymentAdvanceHandler);
        paymentChoiceHandler.getHandler.mockReturnValue(mockPaymentChoiceHandler);
        MOMOHandler.getHandler.mockReturnValue(mockMOMOHandler);

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
    
    describe('start', ()=>{ 
        it('should set the state variables',()=>{
            state.vars.account = '';
            state.vars.country = '';
            state.vars.marketLang = '';
            marketAccess.start(account, country, marketLang);
            expect(state.vars).toMatchObject({account,country,marketLang});
        });
        it('should call notify ELK',()=>{
            marketAccess.start(account, country, marketLang);
            expect(notifyELK).toHaveBeenCalled();
        });
    
    });
    describe('quantity handler successful callback', ()=>{ 

        beforeEach(() => {
            marketAccess.registerHandlers();
            callback = quantityHandler.getHandler.mock.calls[0][0];                
        });
        it('should prompt for the date',()=>{
            callback();
            expect(global.sayText).toHaveBeenCalledWith('When  Maize will be available');
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
            callback(true);
            expect(global.sayText).toHaveBeenCalledWith('Do you want an Advance payment for your maize? \n1)Yes\n2)No');
            expect(global.promptDigits).toHaveBeenCalledWith(paymentAdvanceHandler.handlerName);
        });
        it('should re-prompt for date confirmation if the user did not confirm the date',()=>{
            callback(false);
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
            expect(global.sayText).toHaveBeenCalledWith('what is Mobile Money company\n1)MTN\n2)Airtel or Tigo');
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
        });
        it('should prompt for the client\'s phone number if the client confirms TIGO',()=>{
            callback(2);
            expect(global.sayText).toHaveBeenCalledWith('Enter Client  Mobile Money Number');
        });
    });

});