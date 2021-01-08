var translations = require('../../translations/message-translations');
var translator = require('../../../utils/translator/translator');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');
var scheduleCall = require('../../utils/scheduleCall');

module.exports = function nationalIdHandler(input) {
    notifyELK();
    var lang = state.vars.lang;
    var getMessage = translator(translations, lang);
    var sbccTable = project.getOrCreateDataTable(service.vars.sbccTable);
    var nationalIdCursor = sbccTable.queryRows({vars: {national_id: input}});
    if (!state.vars.incorrectIdAttempts) {
        state.vars.incorrectIdAttempts = 0;
    }
    if (nationalIdCursor.hasNext()) {
        var record = nationalIdCursor.next().vars;
        state.vars.pin = record.pin;

        // Reset incorrect attempts in case user got it right on second attempt
        state.vars.incorrectIdAttempts = 0;
        sayText(getMessage('pin_menu', {}, lang));
        promptDigits('pin_menu', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5,
        });
    } else {
        state.vars.incorrectIdAttempts += 1;
        if (state.vars.incorrectIdAttempts < 3) {
            sayText(getMessage('try_again', {}, lang));
            promptDigits('national_id', {
                submitOnHash: true,
                maxDigits: 8,
                timeout: 5,
            });
        } else {
            scheduleCall({
                lang: lang,
                desc: 'Call back requested for incorrect national ID entered twice. User phone number is '+ contact.phone_number,
                accountNumber: 'NonClient' + contact.phone_number,
                phoneNumber: contact.phone_number, 
                repeatMenu: 'try_again',
                repeatHandler: 'national_id',
                successMsg: 'incorrect_id'
            });
        }
    }
};