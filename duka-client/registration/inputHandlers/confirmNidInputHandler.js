var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var notifyElk = require('../../../notifications/elk-notification/elkNotification');

var handlerName = 'dcr_nationalId_handler_confirm';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            notifyElk();
            var getMessage = translator(translations, lang);
            if(input == 1) {
                var phoneNumberInputHandler = require('./phoneNumberInputHandler');
                global.sayText(getMessage('enter_phone', {}, lang));
                global.promptDigits(phoneNumberInputHandler.handlerName);
            } else if(input == 2) {
                var nationalIdInputHandler = require('./nationalIdInputHandler');
                global.sayText(getMessage('enter_national_id', {}, lang));
                global.promptDigits(nationalIdInputHandler.handlerName);
            } else {
                var nationalIdConfirmTitle = getMessage('national_id_confirm', {'$national_id': state.vars.duka_client_nid}, lang);
                var confirmMessage = nationalIdConfirmTitle + getMessage('confirm_or_try', {}, lang);
                global.sayText(confirmMessage);
                global.promptDigits(handlerName);
            }
        };
    }
};
