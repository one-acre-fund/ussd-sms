var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var notifyElk = require('../../../notifications/elk-notification/elkNotification');

var handlerName = 'dcr_secondName';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            input = input.replace(/[^a-zA-Z]/gi, '');
            notifyElk();
            var invoiceIdInputHandler = require('./invoiceIdInputHandler');
            var getMessage = translator(translations, lang);
            state.vars.duka_client_second_name = input;
            var promptInvoiceIdMessage = getMessage('enter_invoice_id', {}, lang);
            global.sayText(promptInvoiceIdMessage);
            global.promptDigits(invoiceIdInputHandler.handlerName);
        };
    }
};
