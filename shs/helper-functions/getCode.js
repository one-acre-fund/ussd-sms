
var getCodes = require('../endpoints/getCode');
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);


module.exports = function getcode(account){
    var countryCode;
    var client = JSON.parse(state.vars.client);
    var countries = {
        'KE': {
            id: '404',
            condition: (client.BalanceHistory[0].SeasonName == service.vars.current_enrollment_season_name) || ((client.BalanceHistory[0].TotalCredit) <= (client.BalanceHistory[0].TotalRepayment_IncludingOverpayments))
        },
        'RW': {
            id: '646',
            condition: ((client.BalanceHistory[0].TotalRepayment_IncludingOverpayments * 100) / client.BalanceHistory[0].TotalCredit) >= 60 // repayment for Rwanda must be 60% +
        }
    };
    countryCode = countries[state.vars.country].id;
    console.log(JSON.stringify({countries: countries, countryCode: countryCode}));
    // check if the same condition applies for all countries 
    if(countries[state.vars.country].condition){
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

