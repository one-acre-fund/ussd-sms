var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var notifyElk = require('../../../notifications/elk-notification/elkNotification');

var handlerName = 'dcr_invoice_id';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var confirmInvoiceIdInputHandler = require('./confirmInvoiceIdInputHandler');
            notifyElk();
            var getMessage = translator(translations, lang);
            state.vars.duka_client_invoice_id = input;
            var promptInvoiceIdConfirmTitle = getMessage('invoice_id_confirm', {'$invoice_id': input}, lang);
            var confirmInvoiceMessace = promptInvoiceIdConfirmTitle + getMessage('confirm_or_try', {}, lang);
            global.sayText(confirmInvoiceMessace);
            global.promptDigits(confirmInvoiceIdInputHandler.handlerName);
        };
    }
};
