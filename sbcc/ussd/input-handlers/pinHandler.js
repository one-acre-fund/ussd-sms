var translations = require('../../translations/message-translations');
var translator = require('../../../utils/translator/translator');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var scheduleCall = require('../../utils/scheduleCall');
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
        console.log('Pin is correct.');
        
        contact.vars.lang = lang;
        project.sendMessage({
            message_type: 'call',
            service_id: ivrServiceId,
            to_number: contact.phone_number,
            route_id: routeId,
        });
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
            scheduleCall({
                lang: lang,
                desc:
                    'Call back requested for incorrect pin entered twice. User phone number is ' +
                    contact.phone_number,
                accountNumber: 'NonClient' + contact.phone_number,
                phoneNumber: contact.phone_number,
                repeatMenu: 'try_again',
                repeatHandler: 'pin',
                successMsg: 'incorrect_pin',
            });
        }
    }
};
