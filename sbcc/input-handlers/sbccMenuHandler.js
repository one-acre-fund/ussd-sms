var translations = require('../translations/message-translations');
var translator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var scheduleCall = require('../utils/scheduleCall');

module.exports = function sbccMenuHandler(input) {
    notifyELK();
    var sbcc_variables = state.vars.sbcc_variables;
    var lang = sbcc_variables.lang;
    var backMenu = sbcc_variables.backMenu;
    var getMessage = translator(translations, lang);

    switch (input.replace(/D/g, '')) {
    case '1':
        sayText(getMessage('enter_national_id', {}, lang));
        promptDigits('national_id', {
            submitOnHash: true,
            maxDigits: 8,
            timeout: 5,
        });
        break;
    case '2':
        var userDetails = {
            accountNumber: 'NonClient ' + contact.phone_number,
            phoneNumber: contact.phone_number
        };
        var desc = 'Call back requested for forgotten national ID. User phone number is '+ contact.phone_number;
        scheduleCall(lang, desc, userDetails, 'sbcc_menu');
        break;
    case '3':
        backMenu();
        promptDigits('NonClientMenu', {submitOnHash: true, maxDigits: 2, timeout: 5});
        break;
    default:
        sayText(getMessage('sbcc_menu', {}, lang));
        promptDigits('sbcc_menu', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5,
        });
        break;
    }
};
