var handlerName = 'accountNameHandler';
var translations = require('../../translations');
var createTranslator = require('../../../utils/translator/translator');
module.exports = {
    handlerName: handlerName,
    getHandler: function (onAccountNameSubmitted){
        return function(input){
            if(typeof(input) != undefined){
                onAccountNameSubmitted(input);
            }
            else{
                var translate =  createTranslator(translations, state.vars.marketLang);
                global.sayText(translate('bank_account_name',{}));
                global.promptDigits(handlerName);
            }
        };

    }
};