var handlerName = 'accountNumberHandler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var shsMenuHandler = require('../shs-menu-handler/shsMenuHandler');
var translate =  createTranslator(translations, project.vars.lang);
var roster = require('../../rw-legacy/lib/roster/api');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

module.exports = {
    handlerName: handlerName,
    getHandler: function(){
        return function(input){
            notifyELK();
            state.vars.acccount = input;
            if(roster.authClient(state.vars.acccount,state.vars.country)){
                global.sayText(translate('select_service',{},state.vars.shsLang));
                global.promptDigits(shsMenuHandler.handlerName);
            }
            else{
                global.sayText(translate('account_number_menu',{},state.vars.shsLang));
                global.promptDigits(handlerName);
            }
        };
    }

};