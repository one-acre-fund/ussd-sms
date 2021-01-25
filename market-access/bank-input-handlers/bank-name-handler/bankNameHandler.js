var handlerName = 'bankNameHandler';
var translations = require('../../translations');
var createTranslator = require('../../../utils/translator/translator');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');
module.exports = {
    handlerName: handlerName,
    getHandler: function (onBankNameSubmitted){
        return function(input){
            notifyELK();
            if(typeof(input) != undefined && input != ''){
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