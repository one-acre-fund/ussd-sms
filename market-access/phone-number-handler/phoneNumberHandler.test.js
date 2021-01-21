var {handlerName,getHandler} = require('./phoneNumberHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');
describe('Phone Number handler test', ()=>{

    var phoneNumberHandler;
    var onPhoneSubmitted;
    beforeAll(()=>{
        onPhoneSubmitted = jest.fn();
        phoneNumberHandler = getHandler(onPhoneSubmitted);
        state.vars.marketLang = 'en';
    });
    it('should call ELK',()=>{
        phoneNumberHandler('0786168909');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call onPhoneSubmitted with the entered phone if the phone number is valid',()=>{
        phoneNumberHandler('0786168909');
        expect(onPhoneSubmitted).toHaveBeenCalledWith('0786168909');
    });
    it('should reprompt for input if the phone number length is not equal to 10 digits',()=>{
        phoneNumberHandler('07861689090');
        expect(global.sayText).toHaveBeenCalledWith('Enter Client  Mobile Money Number');
        expect(global.promptDigits).toHaveBeenCalledWith(handlerName);
    });
    it('should reprompt for input if the phone number length does not start with 07',()=>{
        phoneNumberHandler('09861689090');
        expect(global.sayText).toHaveBeenCalledWith('Enter Client  Mobile Money Number');
        expect(global.promptDigits).toHaveBeenCalledWith(handlerName);
    });
});