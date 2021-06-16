
var getCodes = require('../endpoints/getCode');
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);


module.exports = function getcode(account){
    var countryCode;
    var countries = {
        'KE': '404',
        'RW': '646'
    };
    countryCode = countries[state.vars.country];
    var client = JSON.parse(state.vars.client);
    if((client.BalanceHistory[0].SeasonName == project.vars.current_enrollment_season_name) || ((client.BalanceHistory[0].TotalCredit) <= (client.BalanceHistory[0].TotalRepayment_IncludingOverpayments))){
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

