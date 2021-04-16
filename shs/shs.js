var translations = require('./translations');
var createTranslator = require('../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var shsMenuHandler = require('./shs-menu-handler/shsMenuHandler');
var serialNumberHandler = require('./serial-number-handler/serialNumberHandler');
var gLMenuHandler = require('./gL-menu-handler/gLMenuHandler');
var shsTypeHandler = require('./shs-type-handler/shsTypeHandler');
var accountNumberHandler = require('./account-number-handler/accountNumberHandler');
var getCodeSerialHandler = require('./get-code-serial-handler/getCodeSerialHandler');
var registrationTypeHandler = require('./registration-type-handler/registrationTypeHandler');
var replacementHandler = require('./replacement-handler/replacementHandler');
var notifyELK = require('../notifications/elk-notification/elkNotification');
var requestCodeHandler = require('./request-code-handler/requestCodeHandler');
var shsNotification =  require('../notifications/elk-notification/shsNotification');
var moment = require('moment');

var onSerialValidated = function(serialInfo, isCodeRequest){
    var message;
    call.vars.shsSuccess = 'true';
    call.vars.shsKeyCodeType = serialInfo.keyCodeType;
    call.vars.shsCode = serialInfo.keyCode;
    call.vars.shsExpirationDate = moment.unix(serialInfo.expiry).format('MMM Do YY');
    call.vars.shsRequestDate = moment().format('MMM Do YY');
    call.vars.serialNumber = serialInfo.serialNumber;
    call.vars.shsGLForOthers = state.vars.unitForOther;
    var shsInformation = JSON.stringify({shsSuccess: 'true', shsKeyCodeType: serialInfo.keyCodeType, shsCode: serialInfo.keyCode, shsExpirationDate: moment.unix(serialInfo.expiry).format('MMM Do YY'), shsRequestDate: moment().format('MMM Do YY'),serialNumber: serialInfo.serialNumber,unitForOther: state.vars.unitForOther}); 
    //shsInformation.shsSuccess = true;
    //shsNotification(shsInformation,true);
    notifyELK(shsInformation,true);
    if(state.vars.unitForOther == 'true'){
        if(serialInfo.keyCodeType == 'ACTIVATION')
            message = translate('successful_farmer_activation_code',{'$code': serialInfo.keyCode},state.vars.shsLang);
        else if(serialInfo.keyCodeType == 'UNLOCK')
            message = translate('successful_farmer_unlock_code',{'$code': serialInfo.keyCode},state.vars.shsLang);
    }
    else{
        if(serialInfo.keyCodeType == 'ACTIVATION')
            message = translate('successful_activation_code',{'$code': serialInfo.keyCode},state.vars.shsLang);
        else if(serialInfo.keyCodeType == 'UNLOCK')
            message = translate('successful_unlock_code',{'$code': serialInfo.keyCode},state.vars.shsLang);
    }
    if(isCodeRequest){ 
        global.sayText(message);
    }else{
        contact.vars.shsRegistration = 'true';
        project.sendMessage({
            content: message, 
            to_number: contact.phone_number
        });
    }
    global.stopRules();
};
module.exports = {
    registerHandlers: function (){
        addInputHandler(shsMenuHandler.handlerName, shsMenuHandler.getHandler());
        addInputHandler(serialNumberHandler.handlerName, serialNumberHandler.getHandler(onSerialValidated));
        addInputHandler(shsTypeHandler.handlerName, shsTypeHandler.getHandler(onSerialValidated));
        addInputHandler(accountNumberHandler.handlerName, accountNumberHandler.getHandler());
        addInputHandler(getCodeSerialHandler.handlerName, getCodeSerialHandler.getHandler(onSerialValidated));
        addInputHandler(registrationTypeHandler.handlerName, registrationTypeHandler.getHandler());
        addInputHandler(gLMenuHandler.handlerName, gLMenuHandler.getHandler());
        addInputHandler(replacementHandler.handlerName, replacementHandler.getHandler(onSerialValidated));
        addInputHandler(requestCodeHandler.handlerName, requestCodeHandler.getHandler(onSerialValidated));
    },
    start: function(client, country, lang, isGroupLeader,main_menu, main_menu_handler){
        
        notifyELK('testing');
        state.vars.client = client;
        state.vars.account = JSON.parse(state.vars.client).AccountNumber;
        state.vars.country = country;
        state.vars.shsLang = lang;
        state.vars.gL = isGroupLeader;
        state.vars.replacement = '';
        state.vars.unitForOther = 'false';
        state.vars.exists = 'false';
        state.vars.main_menu = main_menu;
        state.vars.main_menu_handler = main_menu_handler;
        translate =  createTranslator(translations, state.vars.shsLang);
        if(isGroupLeader){
            state.vars.gLClient = client;
            global.sayText(translate('gl_menu',{},state.vars.shsLang));
            global.promptDigits(gLMenuHandler.handlerName);

        }else{
            global.sayText(translate('select_service',{},state.vars.shsLang));
            global.promptDigits(shsMenuHandler.handlerName);
        }
    }

};