const {handlerName,getHandler} = require ('.');
var notifyELK = require('../../notifications/elk-notification/elkNotification'); 

jest.mock('../../notifications/elk-notification/elkNotification');
describe('change_order_handler', () => {

    var onPaymentValidated;
    var changeOrderHandler;
    const minimum_amount_paid = true;

    beforeEach(() => {
        sayText.mockReset();
        JSON.parse = jest.fn();
        onPaymentValidated = jest.fn();
        state.vars.minimum_amount_paid = minimum_amount_paid;
        changeOrderHandler = getHandler(onPaymentValidated);     
    });
    it('should be a function', () => {
        expect(changeOrderHandler).toBeInstanceOf(Function);
    });
    it('should call notifyELK ', () => {
        changeOrderHandler('1');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should show a message saying they don\'t meet requirements if repayment is small', () => {
        project.vars.lang = 'en';
        state.vars.minimum_amount_paid = false;
        changeOrderHandler('1');
        expect(sayText).toHaveBeenCalledWith('Sorry, you have not reached your minimum prepayment amount to confirm chickens. Please complete your prepayment if you want to confirm them.');
    });
    it('should not show a message saying they don\'t meet requirements if repayment requirement is met', () => {
        project.vars.lang = 'en';
        state.vars.minimum_amount_paid = true;
        changeOrderHandler('1');
        expect(sayText).not.toHaveBeenCalled();
    });
    it('should call the onPaymentValidated handler if the repayment is satisfied', () => {
        changeOrderHandler('1');
        state.vars.minimum_amount_paid = true;
        expect(onPaymentValidated).toBeCalled();
    });
    it('should show prompt for re-entry if unexpected input', () => {
        project.vars.lang = 'en';
        changeOrderHandler('7');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
});