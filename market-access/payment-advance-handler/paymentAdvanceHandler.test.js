var {handlerName,getHandler} = require('./paymentAdvanceHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');
describe('Payment Advance handler test', ()=>{

    var paymentAdvanceHandler;
    var onAdvancePayment;
    beforeAll(()=>{
        onAdvancePayment = jest.fn();
        paymentAdvanceHandler = getHandler(onAdvancePayment);
        state.vars.marketLang = 'en';
    });
    it('should call ELK',()=>{
        paymentAdvanceHandler();
        expect(notifyELK).toHaveBeenCalled;
    });
    it('should should call onAdvancePayment with 1 if the input is 1',()=>{
        paymentAdvanceHandler('1');
        expect(onAdvancePayment).toHaveBeenCalledWith('1');
    });
    it('should should call onAdvancePayment with 2 if the input is 2',()=>{
        paymentAdvanceHandler('2');
        expect(onAdvancePayment).toHaveBeenCalledWith('2');
    });
    it('should should reprompt for input if the inut is not 1 or 2',()=>{
        paymentAdvanceHandler('3');
        expect(global.sayText).toHaveBeenCalledWith('Do you want an Advance payment for your maize? \n1)Yes\n2)No');
        expect(global.promptDigits).toHaveBeenCalledWith(handlerName);
    });
});
