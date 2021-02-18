var handlerName = 'gLMenuHandler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var accountNumberHandler = require('../account-number-handler/accountNumberHandler'); 
var shsMenuHandler = require('../shs-menu-handler/shsMenuHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

module.exports={
    handlerName: handlerName,
    getHandler: function(){
        return function(input){
            notifyELK();
            if(input == 1){
                global.sayText(translate('select_service',{},state.vars.shsLang));
                global.promptDigits(shsMenuHandler.handlerName);
            }
            else if(input == 2){
                global.sayText(translate('account_number_menu',{},state.vars.shsLang));
                global.promptDigits(accountNumberHandler.handlerName);
            }
            else{
                global.sayText(translate('gl_menu',{},state.vars.shsLang));
                global.promptDigits(handlerName);
            }

        };
    }

};