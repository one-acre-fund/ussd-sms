var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var registerSerial = require('../endpoints/registerSerial');

module.exports = function registerSerialNumber(serialNumber,unitType,replacement){
    var keyCodeType;
    var countryCode;
    var client = JSON.parse(state.vars.client);
    if(state.vars.country == 'KE')
        countryCode = '404';
    if(client.BalanceHistory[0].SeasonName == '2021, Long Rain'){
        if(JSON.parse(state.vars.client).BalanceHistory[0].Balance <= 0){
            keyCodeType = 'UNLOCK';
        }
        else{
            keyCodeType = 'ACTIVATION';
        }
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
        if(client.BalanceHistory[0].TotalCredit <= client.BalanceHistory[0].TotalRepayment_IncludingOverpayments){
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



/*
retuns: {
    "results":[
        {
            "unitType":"biolite",
            "keyCode":"123 456 789",
            "keyCodeType":"unlock | activation"
        },
        {
            "unitType":"sunking",
            "keyCode":"123 466 799",
            "keyCodeType":"unlock | activation"
        }
    ]
}
*/