var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var nationalIdInputHandler = require('./nationalIdInputHandler');
var handlerName = 'duka_client_registration_nationalId_handler_confirm';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var getMessage = translator(translations, lang);
            if(input == 1) {
                global.sayText(getMessage('enter_phone', {}, lang));
                global.promptDigits('duka_client_registration_phone_number');
            } else if(input == 2) {
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
