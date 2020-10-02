const secondNameInputHandler = require('./secondNameInputHandler');
const invoiceIdInputHandler = require('./invoiceIdInputHandler');
const notifyElk = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');
describe.each(['en-ke', 'sw'])('first name input handler', (lang) => {
    it('should prompt the user for invoice id if the second name is valid', () => {
        const handler = secondNameInputHandler.getHandler(lang);
        const message = {
            'sw': 'Tafadhali jibu na Kitambulisho cha mteja cha Erply Invoice',
            'en-ke': 'Please reply with the client\'s Erply Invoice ID'
        };
        state.vars.duka_client_first_name = 'Jamie';
        handler('Fox \' `*1& ^_ ');
        expect(notifyElk).toHaveBeenCalled();
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(state.vars.duka_client_second_name).toEqual('Fox1');
        expect(promptDigits).toHaveBeenCalledWith(invoiceIdInputHandler.handlerName);
    });

    
    it('should reprompt for the second name once the input is invalid', () => {
        const handler = secondNameInputHandler.getHandler(lang);
        const message = {
            'en-ke': 'Please reply with the second name of the client.',
            'sw': 'Tafadhali jibu na jina la pili la mteja.'
        };
        handler('`*& ^_ ');
        expect(notifyElk).toHaveBeenCalled();
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(promptDigits).toHaveBeenCalledWith(secondNameInputHandler.handlerName);
    });
});
