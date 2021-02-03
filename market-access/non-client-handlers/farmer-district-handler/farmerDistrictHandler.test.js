var {handlerName,getHandler} = require('./farmerDistrictHandler');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');
describe('Farmer district handler test', ()=>{

    var farmerDistrictHandler;
    var onDistrictSubmitted;
    beforeAll(()=>{
        onDistrictSubmitted = jest.fn();
        farmerDistrictHandler = getHandler(onDistrictSubmitted);
        state.vars.marketLang = 'en';
    });
    it('should call ELK',()=>{
        farmerDistrictHandler('name');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call onDistrictSubmitted with the entered district name if valid',()=>{
        farmerDistrictHandler('name');
        expect(onDistrictSubmitted).toHaveBeenCalledWith('name');
    });
    it('should reprompt for input if the input is an empty string or unexpected input is entered',()=>{
        farmerDistrictHandler('');
        expect(global.sayText).toHaveBeenCalledWith('Enter the farmer\'s district');
        expect(global.promptDigits).toHaveBeenCalledWith(handlerName);
    });
});