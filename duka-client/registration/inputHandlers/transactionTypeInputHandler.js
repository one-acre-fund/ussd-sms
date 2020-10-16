var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var notifyElk = require('../../../notifications/elk-notification/elkNotification');
var invoiceIdInputHandler = require('./invoiceIdInputHandler');
var handlerName = 'dcr_transaction_type_handler';
var transactionTypes = {
    '1': 'Credit',
    '2': 'Layaway'
};

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            notifyElk();
            var getMessage = translator(translations, lang);
            var transactionType = transactionTypes[input];
            if(transactionType) {
                state.vars.transaction_type = transactionType;
                global.sayText(getMessage('enter_invoice_id', {}, lang));
                global.promptDigits(invoiceIdInputHandler.handlerName);
            } else {
                var transactionMessage = getMessage('transaction_type', {}, lang);
                global.sayText(transactionMessage);
                global.promptDigits(handlerName);
            }
        };
    }
};
