var {handlerName,getHandler} = require('./nameHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');
describe('name handler test', ()=>{

    var nameHandler;
    var onNameSubmitted;
    beforeAll(()=>{
        onNameSubmitted = jest.fn();
        nameHandler = getHandler(onNameSubmitted);
        state.vars.marketLang = 'en';
    });
    it('should call ELK',()=>{
        nameHandler('name');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call onNameSubmitted with the entered name if valid',()=>{
        nameHandler('name');
        expect(onNameSubmitted).toHaveBeenCalledWith('name');
    });
    it('should reprompt for input if the input is an empty string or unexpected input is entered',()=>{
        nameHandler('');
        expect(global.sayText).toHaveBeenCalledWith('Enter the name of person the number is registered to');
        expect(global.promptDigits).toHaveBeenCalledWith(handlerName);
    });
});