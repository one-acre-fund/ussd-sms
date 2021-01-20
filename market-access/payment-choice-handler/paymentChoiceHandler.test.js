var {handlerName,getHandler} = require('./paymentChoiceHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');
describe('Payment Advance handler test', ()=>{

    var paymentChoiceHandler;
    var onPaymentChoice;
    beforeAll(()=>{
        onPaymentChoice = jest.fn();
        paymentChoiceHandler = getHandler(onPaymentChoice);
        state.vars.marketLang = 'en';
    });
    it('should call ELK',()=>{
        paymentChoiceHandler();
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should should call onAdvancePayment with 1 if the input is 1',()=>{
        paymentChoiceHandler('1');
        expect(onPaymentChoice).toHaveBeenCalledWith('1');
    });
    it('should should call onAdvancePayment with 2 if the input is 2',()=>{
        paymentChoiceHandler('2');
        expect(onPaymentChoice).toHaveBeenCalledWith('2');
    });
    it('should should call onAdvancePayment with 3 if the input is 3',()=>{
        paymentChoiceHandler('3');
        expect(onPaymentChoice).toHaveBeenCalledWith('3');
    });
    it('should should reprompt for input if the inut is not 1, 2 or 3',()=>{
        paymentChoiceHandler('4');
        expect(global.sayText).toHaveBeenCalledWith('How would the farmer like to receive your advance payment?\n1) Mobile Money\n2)Bank Account\n3) Back');
        expect(global.promptDigits).toHaveBeenCalledWith(handlerName);

    });
});