var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var notifyElk = require('../../../notifications/elk-notification/elkNotification');

var handlerName = 'dcr_invoice_id_confirm';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang, duka_clients_table) {
        return function(input) {
            notifyElk();
            var getMessage = translator(translations, lang);
            if(input == 1) {
                console.log('state variables: ==>' + JSON.stringify(state.vars));
                if(state.vars.duka_client_first_name) {
                    var confirmFirstSecondName = require('./confirmFirstSecondNameInputHandler');
                    var confirmNamesMessageTitle = getMessage('first_sencond_name_confirm', {
                        '$first_name': state.vars.duka_client_first_name,
                        '$second_name': state.vars.duka_client_second_name
                    }, lang);
        
                    var confirmNamesMessage = confirmNamesMessageTitle + getMessage('confirm_or_try', {}, lang);
                    global.sayText(confirmNamesMessage);
                    global.promptDigits(confirmFirstSecondName.handlerName);
                } else {
                    var clientsTable = project.getOrCreateDataTable(duka_clients_table);
                    var row = clientsTable.createRow({
                        vars: {
                            'invoice_id': state.vars.duka_client_invoice_id,
                            'account_number': state.vars.account_number,
                            'phone_number': state.vars.phone_number,
                            'transaction_type': state.vars.transaction_type
                        }
                    });
                    row.save();
                    global.sayText(getMessage('successfull_transaction', {}, lang));
                    global.stopRules();
                }
            } else if(input == 2) {
                var invoiceIdInputHandler = require('./invoiceIdInputHandler');
                global.sayText(getMessage('enter_invoice_id', {}, lang));
                global.promptDigits(invoiceIdInputHandler.handlerName);
            } else {
                var promptInvoiceIdConfirmTitle = getMessage('invoice_id_confirm', {'$invoice_id': state.vars.duka_client_invoice_id}, lang);
                var confirmInvoiceMessace = promptInvoiceIdConfirmTitle + getMessage('confirm_or_try', {}, lang);
                global.sayText(confirmInvoiceMessace);
                global.promptDigits(handlerName);
            }
        };
    }
};
