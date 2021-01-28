var translations = require('./translations');
var createTranslator = require('../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var shsMenuHandler = require('./shs-menu-handler/shsMenuHandler');
var serialNumberHandler = require('./serial-number-handler/serialNumberHandler');
var gLMenuHandler = require('./gL-menu-handler/gLMenuHandler');
var shsTypeHandler = require('./shs-type-handler/shsTypeHandler');
var accountNumberHandler = require('./accountNumberHandler/accountNumberHandler');
var getCodeSerialHandler = require('./get-code-serial-handler/getCodeSerialHandler');
var registrationTypeHandler = require('./registrationTypeHandler/registrationTypeHandler');
var replacementHandler = require('./replacementHandler/replacementHandler');
var notifyELK = require('../notifications/elk-notification/elkNotification');



var onSerialValidated = function(serialInfo){
    var message;
    if(serialInfo.keyCodeType == 'activation')
        message = translate('successful_activation_code',{'$code': serialInfo.keyCode},state.vars.shsLang);
    else if(serialInfo.keyCodeType == 'unlock')
        message = translate('successful_unlock_code',{'$code': serialInfo.keyCode},state.vars.shsLang);
    global.sayText(message);
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
    },
    start: function(account, country, lang, isGroupLeader,main_menu, main_menu_handler){
        notifyELK();
        state.vars.account = account;
        state.vars.country = country;
        state.vars.shsLang = lang;
        state.vars.gL = isGroupLeader;
        state.vars.replacement = '';
        state.vars.main_menu = main_menu;
        state.vars.main_menu_handler = main_menu_handler;
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