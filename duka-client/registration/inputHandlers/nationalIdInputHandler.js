var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var confirmNidInputHandler = require('./confirmNidInputHandler');
var handlerName = 'dcr_nationalId_handler';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var getMessage = translator(translations, lang);
            var nationalId = input.replace(/\D/g,'');
            if(nationalId.length == 7 || nationalId.length == 8) {
                var nationalIdConfirmTitle = getMessage('national_id_confirm', {'$national_id': nationalId}, lang);
                var confirmMessage = nationalIdConfirmTitle + getMessage('confirm_or_try', {}, lang);
                state.vars.duka_client_nid = nationalId;
                global.sayText(confirmMessage);
                global.promptDigits(confirmNidInputHandler.handlerName);
            } else {
                // there
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
