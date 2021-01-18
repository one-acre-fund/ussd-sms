var {handlerName,getHandler} = require('./dateAvailableHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');
describe('order confirmation handler test', ()=>{

    var dateAvailableHandler;
    var onDateSubmitted;
    beforeAll(()=>{
        onDateSubmitted = jest.fn();
        dateAvailableHandler = getHandler(onDateSubmitted);
        state.vars.marketLang = 'en';
    });
    it('should call ELK',()=>{
        dateAvailableHandler();
        expect(notifyELK).toHaveBeenCalled;
    });
    it('should re-prompt for the date if the input does not mach the dd/mm/yyyy format',()=>{
        dateAvailableHandler('213/234/2020');
        expect(global.sayText).toHaveBeenCalledWith('When  Maize will be available');
        expect(global.promptDigits).toHaveBeenCalledWith(handlerName);
    });
    it('should onDateSubmitted onDateSubmitted if the input i a valid date matching dd/mm/yyyy format',()=>{
        dateAvailableHandler('21/4/2010');
        expect(onDateSubmitted).toHaveBeenCalledWith('21/4/2010');
    });

});