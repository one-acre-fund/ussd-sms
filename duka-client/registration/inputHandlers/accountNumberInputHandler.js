var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var getClient = require('../../../shared/rosterApi/getClient');
var getPhoneNumbers = require('../../../shared/rosterApi/getPhoneNumber');
var registerClient = require('../../../shared/rosterApi/registerClient');
var nationalIdInputHandler = require('./nationalIdInputHandler');
var transactionTypeInputHandler = require('./transactionTypeInputHandler');
var notifyElk = require('../../../notifications/elk-notification/elkNotification');

var handlerName = 'DCAccNumOrnewClient'; 

function getActivePhoneNumber(accNum, country) {
    var phoneNumbers = getPhoneNumbers(accNum, country);
    var activePhoneNumber = phoneNumbers.filter(function(record) {
        return record.IsInactive == false;
    });
    return activePhoneNumber[0] && activePhoneNumber[0].PhoneNumber;
}

/**
 * Checks whether the user has outstanding creedit in any season
 * @param {[object]} BalanceHistory 
 */
function OutstandingCredit(BalanceHistory){
    var withBalance = BalanceHistory.filter(function(record) {
        return record.Balance > 0;
    });

    var outStandingCredit = 0;
    withBalance.forEach(function(record){
        outStandingCredit = outStandingCredit + record.Balance;
    });
    return outStandingCredit;
}

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            notifyElk();
            var getMessage = translator(translations, lang);
            if(input == 0) {
                if(state.vars.dcr_duka_client) {
                    var dcr_duka_client = JSON.parse(state.vars.dcr_duka_client);
                    var registeredClient = registerClient(dcr_duka_client);
                    if(registeredClient) {
                        call.vars.duka_account_number = registeredClient.AccountNumber;
                        notifyElk();
                        var messageToClient = getMessage('thanks_for_registering', {'$account_number': registeredClient.AccountNumber}, lang);
                        project.scheduleMessage({
                            content: messageToClient, 
                            to_number: contact.phone_number,
                            start_time_offset: 0
                        });
                        project.scheduleMessage({
                            content: messageToClient, 
                            to_number: dcr_duka_client.phoneNumber,
                            start_time_offset: 15
                        });
                        console.log('duka client registered. scheduled message for credit officer: ' + messageToClient + ' to: ' + contact.phone_number);
                        console.log('duka client registered. scheduled message for farmer: ' + messageToClient + ' to: ' + JSON.stringify(dcr_duka_client));
                        state.vars.account_number = registeredClient.AccountNumber;
                        state.vars.phone_number = dcr_duka_client.phoneNumber;
                        global.sayText(getMessage('transaction_type', {}, lang));
                        global.promptDigits(transactionTypeInputHandler.handlerName, {
                            submitOnHash: false
                        });
                        return;
                    } else {
                        var nonDukaAccountMessagereprompt = getMessage('duka_client_already_created', {}, lang);
                        global.sayText(nonDukaAccountMessagereprompt);
                        global.promptDigits(handlerName, {
                            submitOnHash: false,
                        });
                        return;
                    }
                }
                var message = getMessage('enter_national_id');
                global.sayText(message);
                global.promptDigits(nationalIdInputHandler.handlerName, {
                    submitOnHash: false,
                    maxDigits: 8
                });
            } else {
                var accountNumber = input.trim();
                var country = 'kenya';
                var client = getClient(accountNumber, country);
                if(client) {
                    // client has an account registered in roster
                    var phone_number = getActivePhoneNumber(accountNumber, country);
                    client.PhoneNumber = phone_number;
                    var outStandingCredit = OutstandingCredit(client.BalanceHistory);
                    
                    if(client.SiteName == 'Duka' || client.DistrictName == 'OAF Duka'){
                        if(outStandingCredit > 0) {
                            // if has an out standing credit, ask them to pay the remaining amount
                            global.sayText(getMessage('outstanding_balance', {'$balance': outStandingCredit}, lang));
                            global.stopRules();
                        } else {
                            state.vars.account_number = accountNumber;
                            state.vars.phone_number = client.PhoneNumber;
                            // has paid everything
                            global.sayText(getMessage('transaction_type', {}, lang));
                            global.promptDigits(transactionTypeInputHandler.handlerName, {
                                submitOnHash: false
                            });
                        }
                    } else {
                        var nonDukaAccountMessage = getMessage('non_duka_account', {}, lang);
                        var credit_officer_details = JSON.parse(state.vars.credit_officer_details);
                        var dukaClient = {
                            firstName: client.FirstName,
                            lastName: client.LastName,
                            phoneNumber: client.PhoneNumber,
                            siteId: credit_officer_details.site_id,
                            districtId: credit_officer_details.district_id,
                            nationalIdNumber: 'DUKA-' + client.NationalId
                        };
                        global.sayText(nonDukaAccountMessage);
                        state.vars.dcr_duka_client = JSON.stringify(dukaClient);
                        global.promptDigits(handlerName, {
                            submitOnHash: false,
                        });
                    }
                } else {
                    global.sayText(getMessage('account_number'));
                    global.promptDigits(handlerName, {
                        submitOnHash: false
                    });
                }
            }
        };
    }
};
