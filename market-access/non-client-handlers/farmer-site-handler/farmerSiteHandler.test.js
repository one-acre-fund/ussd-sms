var {handlerName,getHandler} = require('./farmerSiteHandler');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');
describe('Farmer district handler test', ()=>{

    var farmerSiteHandler;
    var onSiteSubmitted;
    beforeAll(()=>{
        onSiteSubmitted = jest.fn();
        farmerSiteHandler = getHandler(onSiteSubmitted);
        state.vars.marketLang = 'en';
    });
    it('should call ELK',()=>{
        farmerSiteHandler('name');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call onSiteSubmitted with the entered site name if valid',()=>{
        farmerSiteHandler('name');
        expect(onSiteSubmitted).toHaveBeenCalledWith('name');
    });
    it('should reprompt for input if the input is an empty string or unexpected input is entered',()=>{
        farmerSiteHandler('');
        expect(global.sayText).toHaveBeenCalledWith('Enter the farmer\'s site');
        expect(global.promptDigits).toHaveBeenCalledWith(handlerName);
    });
});