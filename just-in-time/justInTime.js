
var translations = require('./translations');
var createTranslator = require('../utils/translator/translator');
var accountNumberHandler = require('./account-number-handler/accountNumberHandler');

module.exports = {
    registerHandlers: function (){
        
        function onAccountNumberValidated(){

        }
        addInputHandler(accountNumberHandler.handlerName, accountNumberHandler.getHandler(onAccountNumberValidated));
    },

    start: function (account, country,lang) {
        notifyELK();
        state.vars.account = account;
        state.vars.country = country;
        state.vars.reg_lang = lang;
        var translate =  createTranslator(translations, state.vars.reg_lang);
        global.sayText(translate('account_number_handler',{},state.vars.reg_lang));
        global.promptDigits(accountNumberHandler.handlerName);
    }
}