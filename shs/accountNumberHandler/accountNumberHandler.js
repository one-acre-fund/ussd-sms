var handlerName = 'accountNumberHandler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var shsMenuHandler = require('../shs-menu-handler/shsMenuHandler');
var translate =  createTranslator(translations, project.vars.lang);

function validateAccount(account){
    //TODO: validate account
    return account;
}
module.exports = {
    handlerName: handlerName,
    getHandler: function(){
        return function(input){
            if(validateAccount(input)){
                state.vars.acccount = input;
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