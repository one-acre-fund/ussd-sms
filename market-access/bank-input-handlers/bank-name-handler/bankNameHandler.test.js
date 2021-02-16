var {handlerName,getHandler} = require('./bankNameHandler');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');
describe('bank name handler test', ()=>{

    var bankBranchHandler;
    var onBankNameSubmitted;
    beforeAll(()=>{
        onBankNameSubmitted = jest.fn();
        bankBranchHandler = getHandler(onBankNameSubmitted);
        state.vars.marketLang = 'en';
    });
    it('should call ELK',()=>{
        bankBranchHandler('branch name');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call onBankNameSubmitted with the entered branch name if valid',()=>{
        bankBranchHandler('bank name');
        expect(onBankNameSubmitted).toHaveBeenCalledWith('bank name');
    });
    it('should reprompt for input if the input is an empty string or unexpected input is entered',()=>{
        bankBranchHandler('');
        expect(global.sayText).toHaveBeenCalledWith('Enter Bank Name');
        expect(global.promptDigits).toHaveBeenCalledWith(handlerName);
    });
});