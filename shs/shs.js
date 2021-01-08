var translations = require('./translations');
var createTranslator = require('../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var shsMenuHandler = require('./shs-menu-handler/shsMenuHandler');
var serialNumberHandler = require('./serial-number-handler/serialNumberHandler');
var rosterAPI = require('../rw-legacy/lib/roster/api');
var gLMenuHandler = require('./gL-menu-handler.js/gLMenuHandler');
var onAccountNumberValidated = function(){

};

var onSerialValidated = function(serialNumber,type){
    var code;
    if(isEnrolledInCurrentSeason(state.vars.accountNumber, state.vars.country)){
        if(JSON.parseInt(state.vars.shsClient).BalanceHistory[0].Balance <= 0){
            if(type)
                code = getCode(serialNumber,true,type);
            else
                code = getCode(serialNumber,true); 
        }
        else{
            if(type)
                code = getCode(serialNumber,false,type);
            else
                code = getCode(serialNumber,false);

        }
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
    start: function(account, country, lang, isGroupLeader){
        state.vars.account = account;
        state.vars.country = country;
        state.vars.shsLang = lang;
        state.vars.gL = isGroupLeader;
        state.vars.action = ' ';
        translate =  createTranslator(translations, state.vars.shsLang);
        if(isGroupLeader){
            global.sayText(translate('gl_menu',{},state.vars.shsLang));
            global.promptDigits(gLMenuHandler.handlerName);

        }else{
            global.sayText(translate('select_service',{},state.vars.shsLang));
            global.promptDigits(shsMenuHandler.handlerName);
        }
    }

};