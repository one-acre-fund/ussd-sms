var handlerName = 'bankBranchHandler';
var translations = require('../../translations');
var createTranslator = require('../../../utils/translator/translator');
module.exports = {
    handlerName: handlerName,
    getHandler: function (onBankBranchSubmitted){
        return function(input){
            if(typeof(input) != undefined){
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