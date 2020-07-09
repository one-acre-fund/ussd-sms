var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');

var handlerName = 'change_order_confirm';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onOrderFinalized){
        return function(input){
            if(input == 0){
                // TODO: add go to main menu
                global.promptDigits(handlerName);
                return;
            }
            else if(input == 1){
                onOrderFinalized();
            }
            else{
                //TODO: handle illegal input
                var translate =  createTranslator(translations, project.vars.lang);
                global.sayText(translate('chicken_final_confrm',{'$number': state.vars.confirmed_number,'$price': (state.vars.confirmed_number * 2400)}));
                var menu = translate(('chicken_final_confrm',{'$number': confirmed_number,'$price': (confirmed_number * 2400)}));
                global.sayText(translate('invalid_try_again', {'$Menu':menu}));
                global.promptDigits(handlerName);
                return;
            }
        };

    }
};