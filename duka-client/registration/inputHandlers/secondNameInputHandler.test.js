const secondNameInputHandler = require('./secondNameInputHandler');
const confirmFirstSecondName = require('./confirmFirstSecondNameInputHandler');

describe.each(['en-ke', 'sw'])('first name input handler', (lang) => {
    it('should prompt the user for first name once the phone number is valid', () => {
        const handler = secondNameInputHandler.getHandler(lang);
        const message = {
            'sw': 'Sajili mteja Jamie Fox\n' + '1) Kudhibitisha\n2) Kujaribu tena.',
            'en-ke': 'Enroll client Jamie Fox\n' + '1) To confirm\n2) To try again.'
        };
        state.vars.duka_client_first_name = 'Jamie';
        handler('Fox');
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(state.vars.duka_client_second_name).toEqual('Fox');
        expect(promptDigits).toHaveBeenCalledWith(confirmFirstSecondName.handlerName);
    });
});
