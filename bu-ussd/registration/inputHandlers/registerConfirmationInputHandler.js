var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var onAccountNumberValidated = require('../../utils/onAccountNumberValidated');
var registerClient = require('../../../shared/rosterApi/registerClient');
var getPhoneNumber = require('../../../shared/rosterApi/getPhoneNumber');
var continueToOrderingHandler = require('./continueToOrderingHandler');

var handlerName = 'bu_reg_confirmation';
function filterPhones(phoneNumbers) {
    // filters out the inactive phones
    return phoneNumbers.filter(function(record) {
        return record.IsInactive === false;
    });
}

module.exports = {
    handlerName: handlerName,
    getHandler: function(language) {
        return function(input) {
            var getMessage = translator(translations, language);
            function invalidChoice() {
                // invalid input/ reprompt
                global.sayText(getMessage('register_confirmation'));
                global.promptDigits(handlerName);
            }

            if(!input || !input.replace(/\D/g, '')) {
                invalidChoice();
                return;
            }
            var choice = input.replace(/\D/g, '');
            if(choice === '1') {
                // continue with registration
                var groupInfo = JSON.parse(state.vars.group_info);
                var newClientInfo = {
                    districtId: groupInfo.districtId,
                    siteId: groupInfo.siteId,
                    groupId: groupInfo.groupId,
                    firstName: state.vars.first_name,
                    lastName: state.vars.last_name,
                    nationalIdNumber: state.vars.national_id,
                    phoneNumber: state.vars.phone_number
                };
                // needs the service.vars.server_name, service.vars.roster_api_key to be set on service entry 
                var registeredClient = registerClient(newClientInfo); // returns a client object
                if(state.vars.duplicated_user) {
                    // client already registered
                    var duplicatedUser = JSON.parse(state.vars.duplicated_user);
                    global.sayText(getMessage('already_registered', {'$account_number': duplicatedUser.AccountNumber}));
                    global.stopRules();
                } else if(registeredClient) {
                    /* successful registration 
                    1. send an sms to the client and group leader/FO
                    2. prompt them of they want to order products
                    */
                    var phoneNumbers = getPhoneNumber(registeredClient.AccountNumber, 'BI') || [];
                    var activePhones = filterPhones(phoneNumbers);
                    var FarmerphoneNumber = activePhones[0] && activePhones[0].PhoneNumber;
                    var smsMessage = getMessage('successfull_registration_sms', {'$account_number': registeredClient.AccountNumber}, language);
                    project.sendMulti({
                        messages: [
                            {
                                'content': smsMessage,
                                'to_number': contact.phone_number, 
                            },
                            {
                                'content': smsMessage,
                                'to_number': FarmerphoneNumber 
                            }
                        ]
                    });
                    global.sayText(getMessage('successfull_registration_popup', {'$account_number': registeredClient.AccountNumber}, language));
                    // handler for ordering choice.
                    global.promptDigits(continueToOrderingHandler.handlerName);
                } else {
                    global.sayText(getMessage('error_registering', {}, language));
                    global.stopRules();
                    /*some other error occured. enrollment might be closed or, wrong input or server error, ...
                    try again later*/
                }

            } else if(choice === '2') {
                // go back to the main menu
                var clientJson = JSON.parse(state.vars.client_json);
                onAccountNumberValidated(language, clientJson);
            } else {
                global.sayText(getMessage('register_confirmation'));
                global.promptDigits(handlerName);
            }
        };
    }
};
