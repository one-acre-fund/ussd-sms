var handlerName = 'bankBranchHandler';
var translations = require('../../translations');
var createTranslator = require('../../../utils/translator/translator');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');
module.exports = {
    handlerName: handlerName,
    getHandler: function (onBankBranchSubmitted){
        return function(input){
            notifyELK();
            if(typeof(input) != undefined && input != ''){
                onBankBranchSubmitted(input);
            }
            else{
                var translate =  createTranslator(translations, state.vars.marketLang);
                global.sayText(translate('bank_branch_menu',{}));
                global.promptDigits(handlerName);
            }
        };

    }
};