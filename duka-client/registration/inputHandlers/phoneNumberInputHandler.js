var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
// var confirmNidInputHandler = require('./confirmNidInputHandler');
var handlerName = 'duka_client_registration_phone_number';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var getMessage = translator(translations, lang);
            var phoneNumber = input.replace(/\D/g,'');
            if(phoneNumber) {
                var phoneNumberConfirm = getMessage('phone_number_confirm', {'$phone_number': phoneNumber}, lang);
                state.vars.duka_client_phone_number = phoneNumber;
                var phoneNumberConfirmPromptMessage = phoneNumberConfirm + getMessage('confirm_or_try', {}, lang);
                global.sayText(phoneNumberConfirmPromptMessage);
                global.promptDigits('duka_client_registration_phone_number_confirm');
            } else {
                var message = getMessage('enter_phone');
                global.sayText(message);
                global.promptDigits(handlerName);
            }
        };
    }
};
