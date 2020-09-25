var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var handlerName = 'dcr_nationalId_handler';
var notifyElk = require('../../../notifications/elk-notification/elkNotification');

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            notifyElk();
            var getMessage = translator(translations, lang);
            var nationalId = input.replace(/\D/g,'');
            if(nationalId.length == 7 || nationalId.length == 8) {
                var confirmNidInputHandler = require('./confirmNidInputHandler');
                var nationalIdConfirmTitle = getMessage('national_id_confirm', {'$national_id': nationalId}, lang);
                var confirmMessage = nationalIdConfirmTitle + getMessage('confirm_or_try', {}, lang);
                state.vars.duka_client_nid = nationalId;
                global.sayText(confirmMessage);
                global.promptDigits(confirmNidInputHandler.handlerName);
            } else {
                var message = getMessage('enter_national_id');
                global.sayText(message);
                global.promptDigits(handlerName, {
                    submitOnHash: false,
                    maxDigits: 8
                });
            }
        };
    }
};
