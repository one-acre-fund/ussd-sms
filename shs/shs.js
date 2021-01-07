var translations = require('./translations');
var createTranslator = require('../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var shsMenuHandler = require('./shs-menu-handler/shsMenuHandler');
var serialNumberHandler = require('./serial-number-handler/serialNumberHandler');
var rosterAPI = require('../rw-legacy/lib/roster/api');
var onAccountNumberValidated = function(){

};

var onSerialValidated = function(input){
    var code;
    if(isEnrolledInCurrentSeason(state.vars.accountNumber, state.vars.country)){
        if(JSON.parseInt(state.vars.shsClient).BalanceHistory[0].Balance <= 0)
            code = getCode(input,true);
        else
            code = getCode(input);
        global.sayText(translate('successful_code_sms',{'$code': code},state.vars.shsLang));
        global.stopRules();
    }
    else{
        global.sayText(translate('unsuccessful_code_sms',{'$code': code},state.vars.shsLang));
        global.stopRules();
    }    
};
var getCode = function(serialNumber,unlock){
    return serialNumber+unlock;
};
var isEnrolledInCurrentSeason = function(accountNumber, country){
    var client = rosterAPI.getClient(accountNumber,country);
    if(client){
        state.vars.shsClient = JSON.stringify(TrimClientJSON(client));
        if(client.BalanceHistory.length > 0){
            if(client.BalanceHistory[0].SeasonName == '2021, Long Rain'){
                return true;
            }
        }
        return false;
    }
    global.sayText(translate('error',{},state.vars.shsLang));
    global.stopRules();
};
var TrimClientJSON = function(client){
    var SeasonCount = client.BalanceHistory.length;
    if (SeasonCount>3){client.BalanceHistory.length = 3;}
    return client;
};
module.exports = {
    registerHandlers: function (){
        addInputHandler(shsMenuHandler.handlerName, shsMenuHandler.getHandler(onAccountNumberValidated));
        addInputHandler(serialNumberHandler.handlerName, serialNumberHandler.getHandler(onSerialValidated));

    },
    start: function(account, country, lang){
        state.vars.account = account;
        state.vars.country = country;
        state.vars.shsLang = lang;
        translate =  createTranslator(translations, state.vars.shsLang);
        global.sayText(translate('select_service',{},state.vars.shsLang));
        global.promptDigits(shsMenuHandler.handlerName);
    }

};