
var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var notifyElk = require('../../../notifications/elk-notification/elkNotification');

var handlerName = 'dcr_phone_number_confirm';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            notifyElk();
            var getMessage = translator(translations, lang);
            if(input == 1) {
                var firstNameInputHandler = require('./firstNameInputHandler');
                global.sayText(getMessage('enter_first_name', {}, lang));
                global.promptDigits(firstNameInputHandler.handlerName);
            } else if(input == 2) {
                var phoneNumberInputHandler = require('./phoneNumberInputHandler');
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
