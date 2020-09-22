const confirmNidInputHandler = require('./confirmNidInputHandler');
var nationalIdInputHandler = require('./nationalIdInputHandler');
var phoneNumberInputHandler = require('./phoneNumberInputHandler');

describe.each(['en-ke', 'sw'])('confirm national id input handler using (%s)', (lang) => {
    it('should prompt for phone number once the user chooses 1 --' + lang, () => {
        const confirmHandler = confirmNidInputHandler.getHandler(lang);
        confirmHandler(1);
        const message = {
            'en-ke': 'Enter client Phone number',
            'sw': 'Ingiza nambari ya simu ya mteja'
        };
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(promptDigits).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName);
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

    it('should reprompt for the national id confirmation if the user selects an invalid option', () => {
        const confirmHandler = confirmNidInputHandler.getHandler(lang);
        state.vars.duka_client_nid = '12345678';
        confirmHandler('000');
        const message = {
            'en-ke': 'You entered 12345678 ID\n' +
            '1) To confirm\n' +
            '2) To try again.',
            'sw': 'Ingiza nambari 12345678 ya kitamburisho. Ingiza\n' +
            '1) Kudhibitisha\n' +
            '2) Kujaribu tena.'
        };
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(promptDigits).toHaveBeenCalledWith(confirmNidInputHandler.handlerName);
    });
});
