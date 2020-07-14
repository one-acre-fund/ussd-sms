var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');
var translate =  createTranslator(translations, project.vars.lang);
var handlerName = 'place_chicken_order';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onPaymentValidated){
        return function(input){
            if(input == 1){
                if(state.vars.minimum_amount_paid == false){
                    global.sayText(translate('chicken_no_minimum_prepayment'));
                    stopRules();
                    return;  
                }
                else{
                    return onPaymentValidated();
                }
            }
            else if(input == 0){
                var backToMain = require('../../rw-legacy/lib/backToMainMenu');
                backToMain();
                return;
            }
            else{
                global.sayText(translate('invalid_try_again', {'$Menu': translate('chicken_place_order')}));
                global.promptDigits(handlerName);
                return;
            }
        };
    }
};