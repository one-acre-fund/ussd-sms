const firstNameInputHandler = require('./firstNameInputHandler');
const secondNameInputHandler = require('./secondNameInputHandler');

describe.each(['en-ke', 'sw'])('first name input handler', (lang) => {
    it('should prompt the user for first name once the phone number is valid', () => {
        const handler = firstNameInputHandler.getHandler(lang);
        const message = {
            'sw': 'Tafadhali jibu na jina la pili la mteja.',
            'en-ke': 'Please reply with the second name of the client.'
        };
        handler('Jamie');
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(state.vars.duka_client_first_name).toEqual('Jamie');
        expect(promptDigits).toHaveBeenCalledWith(secondNameInputHandler.handlerName);
    });
});
