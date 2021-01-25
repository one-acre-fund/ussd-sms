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
        dateAvailableHandler('213/234/2020');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should re-prompt for the date if the input does not mach the dd/mm/yyyy format',()=>{
        dateAvailableHandler('213/234/2020');
        expect(global.sayText).toHaveBeenCalledWith('When  Maize will be available');
        expect(global.promptDigits).toHaveBeenCalledWith(handlerName);
    });
    it('should call onDateSubmitted if the input is a valid date matching dd/mm/yyyy format',()=>{
        dateAvailableHandler('21/4/2022');
        expect(onDateSubmitted).toHaveBeenCalledWith('21/4/2022');
    });
    it('should re-prompt for the date if the input is a date before today',()=>{
        dateAvailableHandler('17/1/2021');
        expect(global.sayText).toHaveBeenCalledWith('When  Maize will be available');
        expect(global.promptDigits).toHaveBeenCalledWith(handlerName);
    });
    it('should re-prompt for the date if the input is a date before today',()=>{
        dateAvailableHandler('not a real date');
        expect(global.sayText).toHaveBeenCalledWith('When  Maize will be available');
        expect(global.promptDigits).toHaveBeenCalledWith(handlerName);
    });

});