var handlerName = 'gLMenuHandler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var shsMenuHandler = require('../shs-menu-handler/shsMenuHandler'); 

module.exports={
    handlerName: handlerName,
    getHandler: function(onAccountNumberReceived){
        return function(input){
            if(input == 1){
                global.sayText(translate('select_service',{},state.vars.shsLang));
                onAccountNumberReceived();
            }
            else if(input == 2){
                global.sayText(translate('account_number_menu',{},state.vars.shsLang));
                global.promptDigits(shsMenuHandler.handlerName);
            }
            else{
                global.sayText(translate('gl_menu',{},state.vars.shsLang));
                global.promptDigits(handlerName);
            }

        };
    }

};