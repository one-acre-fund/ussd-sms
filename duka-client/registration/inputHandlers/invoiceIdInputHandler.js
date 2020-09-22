var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var confirmInvoiceIdInputHandler = require('./confirmInvoiceIdInputHandler');

var handlerName = 'duka_client_registration_invoice_id';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var getMessage = translator(translations, lang);
            state.vars.duka_client_invoice_id = input;
            var promptInvoiceIdConfirmTitle = getMessage('invoice_id_confirm', {'$invoice_id': input}, lang);
            var confirmInvoiceMessace = promptInvoiceIdConfirmTitle + getMessage('confirm_or_try', {}, lang);
            global.sayText(confirmInvoiceMessace);
            global.promptDigits(confirmInvoiceIdInputHandler.handlerName);
        };
    }
};
