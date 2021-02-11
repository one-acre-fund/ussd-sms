var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var registerSerial = require('../endpoints/registerSerial');

module.exports = function registerSerialNumber(serialNumber,unitType,replacement){
    var keyCodeType;
    var countryCode;
    if(state.vars.country == 'KE')
        countryCode = '404';
    if(JSON.parse(state.vars.client).BalanceHistory[0].SeasonName == '2021, Long Rain'){
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
        global.sayText(translate('not_enrolled',{},state.vars.shsLang));
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