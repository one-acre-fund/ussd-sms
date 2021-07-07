service.vars.lang = 'en';
const confirmDeliveryWindowHandler = require('./confirmDeliveryWindowHandler');
const notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');

describe('confirm delivery window handler', () => {
    beforeAll(() => {
        state.vars.capsDetails = JSON.stringify({delivery_window_en: '23 to 30 March'});
        state.vars.confirmed_number = 5;
        state.vars.current_menu_str = '1. confirm chicken\n2. Repayments';
    });
    it('should reprompt if the input is any value other than 1 or 0', () => {
        const onOrderFinalizedMock = jest.fn();
        const handler = confirmDeliveryWindowHandler.getHandler(onOrderFinalizedMock);
        handler(3);
        expect(sayText).toHaveBeenCalledWith('The chickens that you confirmed will be delivered during 23 to 30 March. Do you still want to confirm?\n' +
        '1.Yes\n' +
        '0. Return home');
        expect(promptDigits).toHaveBeenCalledWith(confirmDeliveryWindowHandler.handlerName);
    });
    it('should call on orderFinalized if user enters 1', () => {
        const onOrderFinalizedMock = jest.fn();
        const handler = confirmDeliveryWindowHandler.getHandler(onOrderFinalizedMock);
        handler(1);
        expect(onOrderFinalizedMock).toHaveBeenCalled();
        expect(notifyELK).toHaveBeenCalledTimes(1);
    });
    it('should go back to the main menu once user enters 0', () => {
        const onOrderFinalizedMock = jest.fn();
        const handler = confirmDeliveryWindowHandler.getHandler(onOrderFinalizedMock);
        handler(0);
        expect(sayText).toHaveBeenCalledWith('1. confirm chicken\n2. Repayments');
        expect(promptDigits).toHaveBeenCalledWith('cor_menu_select', { 'submitOnHash': false});
    });
});