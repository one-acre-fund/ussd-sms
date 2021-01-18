var quantityHandler = require('./quantity-handler/quantityHandler');
var dateAvailableHandler = require('./date-available-handler/dateAvailableHandler');
var marketAccess = require('./marketAccess');
var notifyELK = require('../notifications/elk-notification/elkNotification');

jest.mock('./quantity-handler/quantityHandler');
jest.mock('./date-available-handler/dateAvailableHandler');
jest.mock('../notifications/elk-notification/elkNotification');


const mockQuantityHandler  = jest.fn();
const mockDateAvailableHandler = jest.fn();

var account = '250542023';
var country = 'RW';
var marketLang = 'en';
var callback;
describe('marketAccess', () => {
    
    beforeEach(() => {
        quantityHandler.getHandler.mockReturnValue(mockQuantityHandler);
        dateAvailableHandler.getHandler.mockReturnValue(mockDateAvailableHandler);

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
        it('should prompt for the date',()=>{
            callback();
            expect(global.sayText).toHaveBeenCalledWith('Do you want an Advance payment for your maize? \n1)Yes\n2)No');
        });
    });

});