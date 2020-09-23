var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var getClient = require('../../../shared/rosterApi/getClient');
var getPhoneNumbers = require('../../../shared/rosterApi/getPhoneNumber');
var registerClient = require('../../../shared/rosterApi/registerClient');
var nationalIdInputHandler = require('./nationalIdInputHandler');
var invoiceIdInputHandler = require('./invoiceIdInputHandler');

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
            var getMessage = translator(translations, lang);
            if(input == 0) {
                if(state.vars.dcr_duka_client) {
                    var dcr_duka_client = JSON.parse(state.vars.dcr_duka_client);
                    var registeredClient = registerClient(dcr_duka_client);
                    if(registeredClient) {
                        if(state.vars.dcr_credit > 0) {
                            global.sayText(getMessage('outstanding_balance', {'$balance': state.vars.dcr_credit}, lang));
                            global.stopRules();
                            return;
                        }
                        global.sayText(getMessage('enter_invoice_id', {}, lang));
                        global.promptDigits(invoiceIdInputHandler.handlerName, {
                            submitOnHash: false
                        });
                        return;
                    } else {
                        var nonDukaAccountMessagereprompt = getMessage('non_duka_account', {}, lang);
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
                    state.vars.dcr_credit = outStandingCredit;
                    if(client.SiteName == 'Duka'){
                        if(outStandingCredit > 0) {
                            // if has an out standing credit, ask them to pay the remaining amount
                            global.sayText(getMessage('outstanding_balance', {'$balance': outStandingCredit}, lang));
                            global.stopRules();
                        } else {
                            state.vars.account_number = accountNumber;
                            state.vars.phone_number = client.PhoneNumber;
                            // has paid everything
                            global.sayText(getMessage('enter_invoice_id', {}, lang));
                            global.promptDigits(invoiceIdInputHandler.handlerName, {
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
