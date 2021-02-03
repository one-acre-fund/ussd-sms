var translations = require('../../translations/message-translations');
var translator = require('../../../utils/translator/translator');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var scheduleCall = require('../../utils/scheduleCall');

module.exports = function pinMenuHandler(input) {
    notifyELK();
    var lang = state.vars.lang;
    var getMessage = translator(translations, lang);

    switch (input.replace(/D/g, '')) {
    case '1':
        sayText(getMessage('enter_pin', {}, lang));
        promptDigits('pin', {
            submitOnHash: true,
            maxDigits: 4,
            timeout: 5,
        });
        break;
    case '2':
        scheduleCall({
            lang: lang,
            desc: 'Call back requested for forgotten pin. User phone number is '+ contact.phone_number,
            accountNumber: 'NonClient' + contact.phone_number,
            phoneNumber: contact.phone_number, 
            repeatMenu: 'pin_menu',
            repeatHandler: 'pin_menu',
            successMsg: 'OAF_call'
        });
        break;
    case '3':
        sayText(getMessage('enter_national_id', {}, lang));
        promptDigits('national_id', {
            submitOnHash: true,
            maxDigits: 8,
            timeout: 5,
        });
        break;
    default:
        global.sayText(getMessage('pin_menu', {}, lang));
        global.promptDigits('pin_menu', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5,
        });
        break;
    }
};
