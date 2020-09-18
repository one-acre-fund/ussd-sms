const confirmNidInputHandler = require('./confirmNidInputHandler');
var nationalIdInputHandler = require('./nationalIdInputHandler');

describe.each(['en-ke', 'sw'])('confirm national id input handler using (%s)', (lang) => {
    it('should prompt for phone number once the user chooses 1 --' + lang, () => {
        const confirmHandler = confirmNidInputHandler.getHandler(lang);
        confirmHandler(1);
        const message = {
            'en-ke': 'Enter client Phone number',
            'sw': 'Ingiza nambari ya simu ya mteja'
        };
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(promptDigits).toHaveBeenCalledWith('duka_client_registration_phone_number');
    });

    it('should reprompt for the national id if the user selects 2', () => {
        const confirmHandler = confirmNidInputHandler.getHandler(lang);
        confirmHandler(2);
        const message = {
            'en-ke': 'Enter client national ID\n',
            'sw': 'Ingiza nambari ya kitambulisho cha kitaifa cha mteja\n'
        };
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(promptDigits).toHaveBeenCalledWith(nationalIdInputHandler.handlerName);
    });
});
