var translations = require('../translations/message-translations');
var translator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var scheduleCall = require('../utils/scheduleCall');

module.exports = function getHandler(backMenu) {
    return function sbccMenuHandler(input) {
        notifyELK();
        var lang = state.vars.lang;
        var getMessage = translator(translations, lang);
    
        switch (input.replace(/D/g, '')) {
        case '1':
            global.sayText(getMessage('enter_national_id', {}, lang));
            global.promptDigits('national_id', {
                submitOnHash: true,
                maxDigits: 8,
                timeout: 5,
            });
            break;
        case '2':
            scheduleCall({
                lang: lang,
                desc: 'Call back requested for forgotten national ID. User phone number is '+ contact.phone_number,
                accountNumber: 'NonClient' + contact.phone_number,
                phoneNumber: contact.phone_number, 
                repeatMenu: 'sbcc_menu',
                repeatHandler: 'sbcc_menu',
                successMsg: 'OAF_call'
            });
            break;
        case '3':
            backMenu();
            global.promptDigits('NonClientMenu', {submitOnHash: true, maxDigits: 2, timeout: 5});
            break;
        default:
            global.sayText(getMessage('sbcc_menu', {}, lang));
            global.promptDigits('sbcc_menu', {
                submitOnHash: false,
                maxDigits: 2,
                timeout: 5,
            });
            break;
        }
    };
};
