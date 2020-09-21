
var firstNameInputHandler = require('./firstNameInputHandler');
var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var registerClient = require('../../../shared/rosterApi/registerClient');
var logger = require('../../../logger/elk/elk-logger');

var handlerName = 'duka_client_registration_first_second_name_confirm';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang, officer_details, duka_clients_table) {
        return function(input) {
            var getMessage = translator(translations, lang);
            if(input == 1) {
                var clientData = {
                    districtId: officer_details.district_id,
                    siteId: officer_details.site_id,
                    firstName: state.vars.duka_client_first_name,
                    lastName: state.vars.duka_client_second_name,
                    nationalIdNumber: 'DUKA-' + state.vars.duka_client_nid,
                    phoneNumber: state.vars.duka_client_phone_number
                };
                var enrolledClient = registerClient(clientData);
                var accountNumber = enrolledClient && enrolledClient.AccountNumber;
                if(accountNumber) {
                    // successfull registration
                    var clientsTable = project.getOrCreateDataTable(duka_clients_table);
                    var row = clientsTable.createRow({
                        vars: {
                            'invoice_id': state.vars.duka_client_invoice_id,
                            'account_number': accountNumber,
                            'phone_number': state.vars.duka_client_phone_number
                        }
                    });
                    row.save();
                    var messageToClient = getMessage('thanks_for_registering', {'$account_number': accountNumber}, lang);
                    project.sendMessage({
                        content: messageToClient, 
                        to_number: state.vars.duka_client_phone_number
                    });
                    global.stopRules();
                } else {
                    var Log = new logger();
                    Log.error('Unable to register a duka client');
                }
            } else if(input == 2) {
                global.sayText(getMessage('enter_first_name', {}, lang));
                global.promptDigits(firstNameInputHandler.handlerName);
            } else {
                var confirmNamesMessageTitle = getMessage('first_sencond_name_confirm', {
                    '$first_name': state.vars.duka_client_first_name,
                    '$second_name': state.vars.duka_client_second_name
                }, lang);
    
                var confirmNamesMessage = confirmNamesMessageTitle + getMessage('confirm_or_try', {}, lang);
                global.sayText(confirmNamesMessage);
                promptDigits(handlerName);
            }
        };
    }
};
