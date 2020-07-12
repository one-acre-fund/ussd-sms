var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');

var handlerName = 'change_order_confirm';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onOrderFinalized){
        return function(input){
            if(input == 0){
                promptDigits('backToMain',{'submitOnHash': false, 'maxDigits': 1, 'timeout': project.vars.timeout });
            }
            else if(input == 1){
                onOrderFinalized();
            }
            else{
                //TODO: handle illegal input
                var translate =  createTranslator(translations, project.vars.lang);
                global.sayText(translate('invalid_try_again', {'$Menu': translate('chicken_final_confrm',{'$number': state.vars.confirmed_number,'$price': (state.vars.confirmed_number * 2400)})}));
                global.promptDigits(handlerName);
                return;
            }
        };

    }
};