
var helperFunctions = require('./helperFunctions');
var getCode = require('../endpoints/getCode');


module.exports = function getcode(account){
    var countryCode , keyCodeType;
    if(state.vars.country == 'KE')
        countryCode = 404;
    if(helperFunctions.isEnrolledInCurrentSeason(state.vars.account, state.vars.country)){
        if(JSON.parse(state.vars.shsClient).BalanceHistory[0].Balance <= 0){
            keyCodeType = 'unlock';
        }
        else{
            keyCodeType = 'activation';
        }
    }
    var requestData = {
        accountNumber: account,
        countryId: countryCode,
        keyCodeType: keyCodeType
    };
    return getCode(requestData);
};

