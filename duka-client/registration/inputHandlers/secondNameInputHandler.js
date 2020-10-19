var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var notifyElk = require('../../../notifications/elk-notification/elkNotification');

var handlerName = 'dcr_secondName';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            input = input.replace(/[^a-zA-Z0-9]/gi, '');
            notifyElk();
            var transactionTypeInputHandler = require('./transactionTypeInputHandler');
            var getMessage = translator(translations, lang);

            if(!input) {
                global.sayText(getMessage('enter_second_name', {}, lang));
                global.promptDigits(handlerName);
                return;
            }
            state.vars.duka_client_second_name = input;
            var promptInvoiceIdMessage = getMessage('transaction_type', {}, lang);
            global.sayText(promptInvoiceIdMessage);
            global.promptDigits(transactionTypeInputHandler.handlerName);
        };
    }
};
