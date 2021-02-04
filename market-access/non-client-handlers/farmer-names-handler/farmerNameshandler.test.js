var {handlerName,getHandler} = require('./farmerNamesHandler');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');
describe('Farmer name handler test', ()=>{

    var farmerNamesHandler;
    var onFNameSubmitted;
    beforeAll(()=>{
        onFNameSubmitted = jest.fn();
        farmerNamesHandler = getHandler(onFNameSubmitted);
        state.vars.marketLang = 'en';
    });
    it('should call ELK',()=>{
        farmerNamesHandler('name');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call onFNameSubmitted with the entered name if valid',()=>{
        farmerNamesHandler('name');
        expect(onFNameSubmitted).toHaveBeenCalledWith('name');
    });
    it('should reprompt for input if the input is an empty string or unexpected input is entered',()=>{
        farmerNamesHandler('');
        expect(global.sayText).toHaveBeenCalledWith('Enter the farmer\'s names');
        expect(global.promptDigits).toHaveBeenCalledWith(handlerName);
    });
});