
var getCodes = require('../endpoints/getCode');
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);


module.exports = function getcode(account){
    var countryCode;
    if(state.vars.country == 'KE')
        countryCode = '404';
    var client = JSON.parse(state.vars.client);
    if((client.BalanceHistory[0].SeasonName == '2021, Long Rain') || ((client.BalanceHistory[0].TotalCredit) <= (client.BalanceHistory[0].TotalRepayment_IncludingOverpayments))){
        var requestData = {
            accountNumber: account,
            countryCode: countryCode
        }; 
        return getCodes(requestData);
    }
    else{
        global.sayText(translate('previous_loan_message',{},state.vars.shsLang));
        return null;
    }
};

