const secondNameInputHandler = require('./secondNameInputHandler');
const invoiceIdInputHandler = require('./invoiceIdInputHandler');
const notifyElk = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');
describe.each(['en-ke', 'sw'])('first name input handler', (lang) => {
    it('should prompt the user for first name once the phone number is valid', () => {
        const handler = secondNameInputHandler.getHandler(lang);
        const message = {
            'sw': 'Tafadhali jibu na Kitambulisho cha mteja cha Erply Invoice',
            'en-ke': 'Please reply with the client\'s Erply Invoice ID'
        };
        state.vars.duka_client_first_name = 'Jamie';
        handler('Fox \' `*1& ^_ ');
        expect(notifyElk).toHaveBeenCalled();
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(state.vars.duka_client_second_name).toEqual('Fox');
        expect(promptDigits).toHaveBeenCalledWith(invoiceIdInputHandler.handlerName);
    });
});
