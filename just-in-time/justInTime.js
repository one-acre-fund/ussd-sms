
var translations = require('./translations');
var createTranslator = require('../utils/translator/translator');
var accountNumberHandler = require('./account-number-handler/accountNumberHandler');
var notifyELK = require('../notifications/elk-notification/elkNotification');
var translate =  createTranslator(translations, project.vars.lang);
module.exports = {
    registerHandlers: function (){
        
        function onAccountNumberValidated(){
            var client = JSON.parse(state.vars.topUpClient);
            var remainingLoan = 0;
            if(client.BalanceHistory.length > 0){
                client.latestBalanceHistory = client.BalanceHistory[0];
                remainingLoan = client.latestBalanceHistory.TotalCredit - client.latestBalanceHistory.TotalRepayment_IncludingOverpayments;
            }
            if(remainingLoan > 500 ){
                var amountToPay = remainingLoan-500;
                sayText(translate('loan_payment_not_satisfied',{'$amount': amountToPay },state.vars.jitLang));
            }
        }
        addInputHandler(accountNumberHandler.handlerName, accountNumberHandler.getHandler(onAccountNumberValidated));
    },

    start: function (account, country,lang) {
        notifyELK();
        state.vars.account = account;
        state.vars.country = country;
        state.vars.jitLang = lang;
        var translate =  createTranslator(translations, state.vars.jitLang);
        global.sayText(translate('account_number_handler',{},state.vars.jitLang));
        global.promptDigits(accountNumberHandler.handlerName);
    }
};