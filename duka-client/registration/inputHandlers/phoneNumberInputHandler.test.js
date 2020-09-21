const phoneNumberInputHandler = require('./phoneNumberInputHandler');
var confirmPhoneNumberInputHandler = require('./confirmPhoneNumberInputHandler');

describe.each(['en-ke', 'sw'])('phone number input handler', (lang) => {
    it('should prompt the user for first name once the phone number is valid', () => {
        const phoneNumberHandler = phoneNumberInputHandler.getHandler(lang);
        const message = {
            'sw': 'Uliingiza nambari 07620475911 ya simu. Ingiza\n' +
            '1) Kudhibitisha\n' +
            '2) Kujaribu tena.',
            'en-ke': 'You entered phone number 07620475911\n' +
            '1) To confirm\n' +
            '2) To try again.'
        };
        phoneNumberHandler('07620475911');
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(state.vars.duka_client_phone_number).toEqual('07620475911');
        expect(promptDigits).toHaveBeenCalledWith(confirmPhoneNumberInputHandler.handlerName);
    });

    it('should reprompt the user for the phone number once the phone is invalid', () => {
        const phoneNumberHandler = phoneNumberInputHandler.getHandler(lang);
        const message = {
            'sw': 'Ingiza nambari ya simu ya mteja',
            'en-ke': 'Enter client Phone number'
        };
        phoneNumberHandler('');
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(promptDigits).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName);
    });
});
