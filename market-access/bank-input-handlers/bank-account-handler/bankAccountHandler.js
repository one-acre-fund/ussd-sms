var handlerName = 'bankAccountHandler';
var translations = require('../../translations');
var createTranslator = require('../../../utils/translator/translator');
module.exports = {
    handlerName: handlerName,
    getHandler: function (onBankAccountSubmitted){
        return function(input){
            if(typeof(input) != undefined){
                onBankAccountSubmitted(input);
            }
            else{
                var translate =  createTranslator(translations, state.vars.marketLang);
                global.sayText(translate('bank_account_menu',{}));
                global.promptDigits(handlerName);
            }
        };

    }
};