
var phoneNumberInputHandler = require('./phoneNumberInputHandler');
var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');

var handlerName = 'duka_client_registration_phone_number_confirm';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var getMessage = translator(translations, lang);
            if(input == 1) {
                global.sayText(getMessage('enter_first_name', {}, lang));
                global.promptDigits('duka_client_registration_first_name');
            } else if(input == 2) {
                global.sayText(getMessage('enter_phone', {}, lang));
                global.promptDigits(phoneNumberInputHandler.handlerName);
            } else {
                var phoneNumberConfirm = getMessage('phone_number_confirm', {'$phone_number': state.vars.duka_client_phone_number}, lang);
                var phoneNumberConfirmPromptMessage = phoneNumberConfirm + getMessage('confirm_or_try', {}, lang);
                global.sayText(phoneNumberConfirmPromptMessage);
                global.promptDigits(handlerName);
            }
        };
    }
};
