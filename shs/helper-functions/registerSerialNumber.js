var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var registerSerial = require('../endpoints/registerSerial');
var getkeyCodeType = require('./getkeyCodeType');

var countries = {
    'KE': '404',
    'RW': '646'
};

module.exports = function registerSerialNumber(serialNumber,unitType,replacement){
    var countryCode;
    var client = JSON.parse(state.vars.client);
    countryCode = countries[state.vars.country];
    var keyCodeType = getkeyCodeType(state.vars.country, client.BalanceHistory[0]);

    if(client.BalanceHistory[0].SeasonName == service.vars.current_enrollment_season_name){
        var requestData = {
            accountNumber: state.vars.account,
            countryCode: countryCode,
            unitSerialNumber: serialNumber,
            keyCodeType: keyCodeType,
            unitType: unitType,
            isReplacement: replacement
        };
        console.log('requ'+JSON.stringify(requestData));
        return registerSerial(requestData);
    }
    else{
        // if client wants an unlock code after they have paid all
        if(client.BalanceHistory[0].TotalCredit <= client.BalanceHistory[0].TotalRepayment_IncludingOverpayments && state.vars.country === 'KE'){
            requestData = {
                accountNumber: state.vars.account,
                countryCode: countryCode,
                unitSerialNumber: serialNumber,
                keyCodeType: 'UNLOCK',
                unitType: unitType,
                isReplacement: replacement
            };
            return registerSerial(requestData);
        }
        global.sayText(translate('previous_loan_message',{},state.vars.shsLang));
        return null;
    }
    
};
