var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var notifyElk = require('../../../notifications/elk-notification/elkNotification');

var handlerName = 'dcr_phone_number';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            notifyElk();
            var getMessage = translator(translations, lang);
            var phoneNumber = input.replace(/\D/g,'');
            if(phoneNumber) {
                var confirmPhoneNumberInputHandler = require('./confirmPhoneNumberInputHandler');
                var phoneNumberConfirm = getMessage('phone_number_confirm', {'$phone_number': phoneNumber}, lang);
                state.vars.duka_client_phone_number = phoneNumber;
                var phoneNumberConfirmPromptMessage = phoneNumberConfirm + getMessage('confirm_or_try', {}, lang);
                global.sayText(phoneNumberConfirmPromptMessage);
                global.promptDigits(confirmPhoneNumberInputHandler.handlerName);
            } else {
                var message = getMessage('enter_phone');
                global.sayText(message);
                global.promptDigits(handlerName);
            }
        };
    }
};
