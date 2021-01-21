var {handlerName,getHandler} = require('./bankAccountHandler');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');
describe('bank account handler test', ()=>{

    var bankAccountHandler;
    var onBankAccountSubmitted;
    beforeAll(()=>{
        onBankAccountSubmitted = jest.fn();
        bankAccountHandler = getHandler(onBankAccountSubmitted);
        state.vars.marketLang = 'en';
    });
    it('should call ELK',()=>{
        bankAccountHandler('44-444-444');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call onBankAccountSubmitted with the entered account if valid',()=>{
        bankAccountHandler('44-444-444');
        expect(onBankAccountSubmitted).toHaveBeenCalledWith('44-444-444');
    });
    it('should reprompt for input if the input is an empty string or unexpected input is entered',()=>{
        bankAccountHandler('');
        expect(global.sayText).toHaveBeenCalledWith('Enter Farmer Bank Account Number');
        expect(global.promptDigits).toHaveBeenCalledWith(handlerName);
    });
});