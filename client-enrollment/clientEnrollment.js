var roster = require('../rw-legacy/lib/roster/api');
var getFOInfo = require('../Roster-endpoints/Fo-info/getFoInfo');
var translations = require('./translations');
var createTranslator = require('../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);

module.exports = {

    start: function (account, country,lang) {
        state.vars.account = account;
        state.vars.country = country;
        state.vars.enr_lang = lang;
        var client_auth = roster.authClient(state.vars.account, country);
        if(client_auth){
            var client = roster.getClient(state.vars.account, state.vars.country);
        }
        if(client){
            if(client.BalanceHistory.length > 0){
                client.latestBalanceHistory = client.BalanceHistory[0];
            }
            var remainingLoan =  client.latestBalanceHistory.TotalCredit - client.latestBalanceHistory.TotalRepayment_IncludingOverpayments;
            console.log('remaining loan:'+ remainingLoan);
            if(remainingLoan > 0 ){
                sayText(translate('loan_payment_not_satisfied',{'$amount': remainingLoan },state.vars.enr_lang));
            }
            else{
                var foInfo = getFOInfo(client.DistrictId,client.SiteId,state.vars.enr_lang);
                console.log(foInfo);
                if(foInfo){
                    var message = translate('registration_message' , {'$phone': foInfo.phoneNumber}, state.vars.enr_lang);
                    project.sendMessage({
                        content: message, 
                        to_number: contact.phone_number
                    });
                }
            }
        }
        else{
            sayText(translate('account_not_found',{},contact.vars.lang));
        }
    }

};