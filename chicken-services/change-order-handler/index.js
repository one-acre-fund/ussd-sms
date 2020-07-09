var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');

var handlerName = 'change_chicken';
module.exports = {
    handlerName: handlerName,
    getHandler:  function (onPaymentValidated) {
        return function (input) {
            if(input == 0){
                //TODO: back to main
                global.promptDigits('backToMain',{'submitOnHash': false, 'maxDigits': 1, 'timeout': timeout_length });
                return;
            }
            else if(input == 1){
                if(state.vars.minimum_amount_paid == false){
                    console.log(state.vars.minimum_amount_paid);
                    var translate =  createTranslator(translations, project.vars.lang);
                    global.sayText(translate('chicken_no_minimum_prepayment'));
                    stopRules();
                    return;  
                }
                else{
                    onPaymentValidated();
                }           
            }
            else{
                //TODO: 
                var translate =  createTranslator(translations, project.vars.lang);
                global.sayText(translate('chicken_already_confirmed',{'$name':JSON.parse(state.vars.client_json).FirstName,'$number': state.vars.chcken_nber}));
                global.promptDigits(handlerName);
                return;
            }
            
        }
    }
};
