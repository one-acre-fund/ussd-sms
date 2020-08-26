var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');
var handlerName = 'change_order_confirm';
var notifyELK = require('../../notifications/elk-notification/elkNotification'); 
module.exports = {
    handlerName: handlerName,
    getHandler: function(onOrderFinalized){
        return function(input){
            notifyELK();
            if(input == 0){
                var backToMain = require('../../rw-legacy/lib/backToMainMenu');
                backToMain();
            }
            else if(input == 1){
                onOrderFinalized();
            }
            else{
                var translate =  createTranslator(translations, project.vars.lang);
                global.sayText(translate('invalid_try_again', {'$Menu': translate('chicken_final_confrm',{'$number': state.vars.confirmed_number,'$price': (state.vars.confirmed_number * 2400)})}));
                global.promptDigits(handlerName);
                return;
            }
        };

    }
};