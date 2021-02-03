

var registerSerial = require('../endpoints/register-serial');

var helperFunctions = require('./helperFunctions');

module.exports = function registerSerialNumber(serialNumber,unitType,replacement){
    var keyCodeType;
    var countryCode;
    if(state.vars.country == 'KE')
        countryCode = 404;
    if(helperFunctions.isEnrolledInCurrentSeason(state.vars.account, state.vars.country)){
        if(JSON.parse(state.vars.shsClient).BalanceHistory[0].Balance <= 0){
            keyCodeType = 'unlock';
        }
        else{
            keyCodeType = 'activation';
        }
        var requestData = {
            accountNumber: state.vars.account,
            countryId: countryCode,
            unitSerialNumber: serialNumber,
            keyCodeType: keyCodeType,
            unitType: unitType,
            isReplacement: replacement
        };
        return registerSerial(requestData);
    }
    return 'not_Eligible';
    
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