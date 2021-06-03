var translations = require('../../translations/message-translations');
var translator = require('../../../utils/translator/translator');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');

module.exports = function nationalIdHandler(input) {
    notifyELK();
    var lang = state.vars.lang;
    var getMessage = translator(translations, lang);
    var sbccTable = project.getOrCreateDataTable(service.vars.sbccTable);
    var nationalIdCursor = sbccTable.queryRows({
        vars: { national_id: input },
    });
    if (!state.vars.incorrectIdAttempts) {
        state.vars.incorrectIdAttempts = 0;
    }
    if (nationalIdCursor.hasNext()) {
        var record = nationalIdCursor.next().vars;
        state.vars.pin = record.pin;
        contact.vars.sbccAge = record.age;
        contact.vars.sbccGender = record.gender;

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
            sayText(getMessage('forgotten-national-id', {}, lang));
        }
    }
};
