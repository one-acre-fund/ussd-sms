const firstNameInputHandler = require('./firstNameInputHandler');
const secondNameInputHandler = require('./secondNameInputHandler');
const notifyElk = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');
describe.each(['en-ke', 'sw'])('first name input handler', (lang) => {
    it('should prompt the user for the second name once the first name is valid', () => {
        const handler = firstNameInputHandler.getHandler(lang);
        const message = {
            'sw': 'Tafadhali jibu na jina la pili la mteja.',
            'en-ke': 'Please reply with the second name of the client.'
        };
        handler('Jamie \' `*1& ^_ ');
        expect(notifyElk).toHaveBeenCalled();
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(state.vars.duka_client_first_name).toEqual('Jamie1');
        expect(promptDigits).toHaveBeenCalledWith(secondNameInputHandler.handlerName);
    });

    it('should reprompt for the first name once the input is invalid', () => {
        const handler = firstNameInputHandler.getHandler(lang);
        const message = {
            'en-ke': 'Please reply with the first name of the client.',
            'sw': 'Tafadhali jibu na jina la kwanza la mteja.'
        };
        handler('`*& ^_ ');
        expect(notifyElk).toHaveBeenCalled();
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(promptDigits).toHaveBeenCalledWith(firstNameInputHandler.handlerName);
    });

    
});
