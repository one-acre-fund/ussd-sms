var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');
var translate =  createTranslator(translations, project.vars.lang);

var handlerName = 'change_chicken';
module.exports = {
    handlerName: handlerName,
    getHandler: function (onPaymentValidated) {
        return function (input) {
            if(input == 0){
                global.promptDigits('backToMain',{'submitOnHash': false, 'maxDigits': 0, 'timeout': 0 });
                return;
            }
            else if(input == 1){
                if(state.vars.minimum_amount_paid == false){
                    console.log(state.vars.minimum_amount_paid);
                    global.sayText(translate('chicken_no_minimum_prepayment'));
                    global.stopRules();
                    return;  
                }
                else{
                    onPaymentValidated();
                }           
            }
            else{
                //TODO: 
                global.sayText(translate('chicken_already_confirmed',{'$name': JSON.parse(state.vars.client_json).FirstName,'$number': state.vars.chcken_nber}));
                global.promptDigits(handlerName);
                return;
            }
            
        };
    }
};
