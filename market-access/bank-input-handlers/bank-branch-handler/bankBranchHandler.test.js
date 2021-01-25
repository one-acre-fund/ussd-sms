var {handlerName,getHandler} = require('./bankBranchHandler');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');
describe('bank branch name handler test', ()=>{

    var bankBranchHandler;
    var onBankBranchSubmitted;
    beforeAll(()=>{
        onBankBranchSubmitted = jest.fn();
        bankBranchHandler = getHandler(onBankBranchSubmitted);
        state.vars.marketLang = 'en';
    });
    it('should call ELK',()=>{
        bankBranchHandler('branch name');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call onBankBranchSubmitted with the entered branch name if valid',()=>{
        bankBranchHandler('branch name');
        expect(onBankBranchSubmitted).toHaveBeenCalledWith('branch name');
    });
    it('should reprompt for input if the input is an empty string or unexpected input is entered',()=>{
        bankBranchHandler('');
        expect(global.sayText).toHaveBeenCalledWith('Enter Bank Branch');
        expect(global.promptDigits).toHaveBeenCalledWith(handlerName);
    });
});