var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');

var handlerName = 'place_chicken_order';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onPaymentValidated){
        return function(input){
            if(input == 1){
                if(state.vars.minimum_amount_paid == false){
                    console.log(state.vars.minimum_amount_paid);
                    var translate =  createTranslator(translations, project.vars.lang);
                    global.sayText(translate('chicken_no_minimum_prepayment'));
                    stopRules();
                    return;  
                }
                else{
                    return onPaymentValidated();
                }
            }
            else if(input == 0){
                //Todo send back to main
                promptDigits('backToMain',{'submitOnHash': false, 'maxDigits': 1, 'timeout': timeout_length });
                return;
            }
            else{
                var translate =  createTranslator(translations, project.vars.lang);
                var menu = translate('chicken_place_order');
                global.sayText(translate('invalid_try_again', {'$Menu':menu}));
                global.promptDigits(handlerName);
                return;
            }
        };
    }
};