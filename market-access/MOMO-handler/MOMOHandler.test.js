var {handlerName,getHandler} = require('./MOMOHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');
describe('MOMO handler test', ()=>{

    var MOMOHandler;
    var onMOMOChosen;
    beforeAll(()=>{
        onMOMOChosen = jest.fn();
        MOMOHandler = getHandler(onMOMOChosen);
        state.vars.marketLang = 'en';
    });
    it('should call ELK',()=>{
        MOMOHandler();
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should call onMOMOChosen with 1 if the input is 1(mtn)',()=>{
        MOMOHandler('1');
        expect(onMOMOChosen).toHaveBeenLastCalledWith('1');

    });
    it('should call onMOMOChosen with 2 if the input is 2(airtel)',()=>{
        MOMOHandler('2');
        expect(onMOMOChosen).toHaveBeenLastCalledWith('2');

    });
    it('should call onMOMOChosen with 3 if the input is 3(back)',()=>{
        MOMOHandler('3');
        expect(onMOMOChosen).toHaveBeenLastCalledWith('3');
    });
    it('should reprompt for input if the input is not 1(mtn) or 2(airtel) or 3',()=>{
        MOMOHandler('4');
        expect(global.sayText).toHaveBeenLastCalledWith('what is Mobile Money company\n1)MTN\n2)Airtel or Tigo\n3)Back');
        expect(global.promptDigits).toHaveBeenLastCalledWith(handlerName);
    });
});