var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var invoiceIdInputHandler = require('./invoiceIdInputHandler');

var handlerName = 'dcr_secondName';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var getMessage = translator(translations, lang);
            state.vars.duka_client_second_name = input;
            var promptInvoiceIdMessage = getMessage('enter_invoice_id', {}, lang);
            global.sayText(promptInvoiceIdMessage);
            global.promptDigits(invoiceIdInputHandler.handlerName);
        };
    }
};
