var {handlerName,getHandler} = require('./nationalIDHandler');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');
describe('Farmer district handler test', ()=>{

    var nationalIDHandler;
    var onNationalIdSubmitted;
    beforeAll(()=>{
        onNationalIdSubmitted = jest.fn();
        nationalIDHandler = getHandler(onNationalIdSubmitted);
        state.vars.marketLang = 'en';
    });
    it('should call ELK',()=>{
        nationalIDHandler('123');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call onNationalIdSubmitted with the entered national ID if valid',()=>{
        nationalIDHandler('1234');
        expect(onNationalIdSubmitted).toHaveBeenCalledWith('1234');
    });
    it('should reprompt for input if the input is an empty string or unexpected input is entered',()=>{
        nationalIDHandler('');
        expect(global.sayText).toHaveBeenCalledWith('Enter Farmer\'s national ID');
        expect(global.promptDigits).toHaveBeenCalledWith(handlerName);
    });
});