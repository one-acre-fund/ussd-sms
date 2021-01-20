var handlerName = 'bankNameHandler';
var translations = require('../../translations');
var createTranslator = require('../../../utils/translator/translator');
module.exports = {
    handlerName: handlerName,
    getHandler: function (onBankNameSubmitted){
        return function(input){
            if(typeof(input) != undefined){
                onBankNameSubmitted(input);
            }
            else{
                var translate =  createTranslator(translations, state.vars.marketLang);
                global.sayText(translate('bank_name_menu',{}));
                global.promptDigits(handlerName);
            }
        };

    }
};