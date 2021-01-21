var handlerName = 'bankAccountHandler';
var translations = require('../../translations');
var createTranslator = require('../../../utils/translator/translator');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');
module.exports = {
    handlerName: handlerName,
    getHandler: function (onBankAccountSubmitted){
        return function(input){
            notifyELK();
            if(typeof(input) != undefined && input != ''){
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