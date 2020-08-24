const {handlerName,getHandler} = require ('.');
var notifyELK = require('../../notifications/elk-notification/elkNotification'); 

jest.mock('../../notifications/elk-notification/elkNotification');
describe('change_order_confirm', () => {
    var changeOrderHandler;
    var onOrderFinalized;
    const confirmed_number = '2';

    beforeEach(() => {
        sayText.mockReset();
        onOrderFinalized = jest.fn();
        state.vars.confirmed_number = confirmed_number;
        changeOrderHandler = getHandler(onOrderFinalized);
    });
    it('should be a function', () => {
        expect(changeOrderHandler).toBeInstanceOf(Function);
    });
    it('should call notifyELK ', () => {
        changeOrderHandler('1');
        expect(notifyELK).toHaveBeenCalled();
    });
    it('should show a message for retry if is not zero', () => {
        project.vars.lang = 'en';
        changeOrderHandler('7');
        expect(sayText).toHaveBeenCalledWith(`Invaid input, please try again.  You are confirming ${confirmed_number} ` 
        + `chickens. Your total credit for chickens is ${confirmed_number * 2400} `
        +'Rwf. Your chickens will be ready within 2 months! 1: Confirm 0: Return home');
    });
    it('should show prompt for retry if is not zero', () => {
        project.vars.lang = 'en';
        changeOrderHandler('7');
        expect(promptDigits).toHaveBeenCalledWith(handlerName);
    });
    it('should call the onValidated handler if successful', () => {
        changeOrderHandler('1');
        expect(onOrderFinalized).toBeCalled();
    });

});