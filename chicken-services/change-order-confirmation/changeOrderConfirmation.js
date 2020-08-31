var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');
var translate =  createTranslator(translations, project.vars.cor_lang);
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
                var CheckChickenCapByDistrict = require('../check-chicken-cap-by-district/CheckChickenCapByDistrict');
                var possibleChickensPerDistrict = CheckChickenCapByDistrict(JSON.parse(state.vars.client_json).DistrictId,new Date().getMonth()+1);
                if(state.vars.confirmed_number > possibleChickensPerDistrict){
                    global.sayText(translate('chicken_cap_reached'));
                    stopRules();
                }
                else{
                    onOrderFinalized();
                }  
            }
            else{
                global.sayText(translate('invalid_try_again', {'$Menu': translate('chicken_final_confrm',{'$number': state.vars.confirmed_number,'$price': (state.vars.confirmed_number * 2400)})}));
                global.promptDigits(handlerName);
                return;
            }
        };

    }
};