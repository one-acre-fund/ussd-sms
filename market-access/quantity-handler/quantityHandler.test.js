var {handlerName,getHandler} = require('./quantityHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');
describe('order confirmation handler test', ()=>{

    var quantityHandler;
    var onQuantitySubmitted;
    beforeAll(()=>{
        onQuantitySubmitted = jest.fn();
        quantityHandler = getHandler(onQuantitySubmitted);
        state.vars.marketLang = 'en';
    });

    it('should call ELK',()=>{
        quantityHandler();
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should reprompt for the quantity if the input is less or equal to zero',()=>{
        quantityHandler('0');
        expect(global.sayText).toHaveBeenCalledWith('Quantity of Unshelled Maize (Kgs)');
        expect(global.promptDigits).toHaveBeenCalledWith(handlerName);
    });
    it('should call  onQuantitySubmitted if the input is valid(greater than 0)',()=>{
        quantityHandler(200);
        expect(onQuantitySubmitted).toHaveBeenCalledWith(200);
    });

});