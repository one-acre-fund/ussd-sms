var translations = require('../../translations/message-translations');
var translator = require('../../../utils/translator/translator');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var ivrServiceId = 'SV535e0ec81dc27e51';
var routeId = 'PN54d237477649c512';

module.exports = function pinHandler(input) {
    notifyELK();
    var lang = state.vars.lang;
    var getMessage = translator(translations, lang);
    if (!state.vars.incorrectPinAttempts) {
        state.vars.incorrectPinAttempts = 0;
    }
    if (input == state.vars.pin) {
        // Reset incorrect pin attempts in case user got it right on second attempt
        state.vars.incorrectPinAttempts = 0;

        contact.vars.sbccLang = lang;
        project.sendMessage({
            message_type: 'call',
            service_id: ivrServiceId,
            to_number: contact.phone_number,
            route_id: routeId,
        });
        var timeSent = Date.now();
        contact.vars.sbcc_ussd_ended_at = new Date(timeSent).toString();
    } else {
        state.vars.incorrectPinAttempts += 1;
        if (state.vars.incorrectPinAttempts < 3) {
            sayText(getMessage('try_again', {}, lang));
            promptDigits('pin', {
                submitOnHash: true,
                maxDigits: 4,
                timeout: 5,
            });
        } else {
            sayText(getMessage('forgotten-pin', {}, lang));
        }
    }
};
