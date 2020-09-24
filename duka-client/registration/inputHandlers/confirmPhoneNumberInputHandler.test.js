const confirmPhoneNumberInputHandler = require('./confirmPhoneNumberInputHandler');
const phoneNumberInputHandler = require('./phoneNumberInputHandler');
const firstNameInputHandler = require('./firstNameInputHandler');
const notifyElk = require('../../../notifications/elk-notification/elkNotification');

jest.mock('../../../notifications/elk-notification/elkNotification');

describe.each(['en-ke', 'sw'])('confirm phone number input handler using (%s)', (lang) => {
   
    it('should send the elk notification', () => {
        const confirmHandler = confirmPhoneNumberInputHandler.getHandler(lang);
        confirmHandler(1);
        expect(notifyElk).toHaveBeenCalled();
    });
    
    it('should prompt for first name once the user chooses 1 --' + lang, () => {
        const confirmHandler = confirmPhoneNumberInputHandler.getHandler(lang);
        confirmHandler(1);
        const message = {
            'en-ke': 'Please reply with the first name of the client.',
            'sw': 'Tafadhali jibu na jina la kwanza la mteja.'
        };
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(promptDigits).toHaveBeenCalledWith(firstNameInputHandler.handlerName);
    });

    it('should prompt for the phone number once the user chooses 2 --' + lang, () => {
        const confirmHandler = confirmPhoneNumberInputHandler.getHandler(lang);
        confirmHandler(2);
        const message = {
            'en-ke': 'Enter client Phone number',
            'sw': 'Ingiza nambari ya simu ya mteja'
        };
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(promptDigits).toHaveBeenCalledWith(phoneNumberInputHandler.handlerName);
    });

    it('should reprompt for the phone number confirmation once the user chooses otherwise --' + lang, () => {
        const confirmHandler = confirmPhoneNumberInputHandler.getHandler(lang);
        state.vars.duka_client_phone_number = '0765435642';
        confirmHandler('00');
        const message = {
            'en-ke': 'You entered phone number 0765435642\n' +
            '1) To confirm\n' +
            '2) To try again.',
            'sw': 'Uliingiza nambari 0765435642 ya simu. Ingiza\n' +
            '1) Kudhibitisha\n' +
            '2) Kujaribu tena.'
        };
        expect(sayText).toHaveBeenCalledWith(message[lang]);
        expect(promptDigits).toHaveBeenCalledWith(confirmPhoneNumberInputHandler.handlerName);
    });
});
