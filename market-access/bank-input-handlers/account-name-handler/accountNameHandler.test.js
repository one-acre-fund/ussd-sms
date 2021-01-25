var {handlerName,getHandler} = require('./accountNameHandler');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');
describe('account name handler test', ()=>{

    var accountNameHandler;
    var onAccountNameSubmitted;
    beforeAll(()=>{
        onAccountNameSubmitted = jest.fn();
        accountNameHandler = getHandler(onAccountNameSubmitted);
        state.vars.marketLang = 'en';
    });
    it('should call ELK',()=>{
        accountNameHandler('accountName');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call onAccountNameSubmitted with the entered name if valid',()=>{
        accountNameHandler('accountName');
        expect(onAccountNameSubmitted).toHaveBeenCalledWith('accountName');
    });
    it('should reprompt for input if the input is an empty string or unexpected input is entered',()=>{
        accountNameHandler('');
        expect(global.sayText).toHaveBeenCalledWith('Enter Farmer\'s Account Name');
        expect(global.promptDigits).toHaveBeenCalledWith(handlerName);
    });
});