var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');
var translate =  createTranslator(translations, service.vars.lang);
var handlerName = 'change_order_confirm';
var notifyELK = require('../../notifications/elk-notification/elkNotification'); 
module.exports = {
    handlerName: handlerName,
    getHandler: function(){
        return function(input){
            notifyELK();
            if(input == 0){
                var backToMain = require('../../rw-legacy/lib/backToMainMenu');
                backToMain();
            }
            else if(input == 1){
                var CheckChickenCapByDistrict = require('../check-chicken-cap-by-district/CheckChickenCapByDistrict');
                var possibleChickensPerDistrict = CheckChickenCapByDistrict(JSON.parse(state.vars.client_json));
                if(state.vars.confirmed_number > possibleChickensPerDistrict){
                    global.sayText(translate('chicken_cap_reached'));
                    global.stopRules();
                }
                else{
                    // provide the delivery window 
                    var confirmDeliveryWindowHandler = require('../confirm-delivery-window-handler/confirmDeliveryWindowHandler');
                    var capsDetails = JSON.parse(state.vars.capsDetails);
                    var chicken_number = state.vars.confirmed_number;

                    var lang = service.vars.lang;
                    global.sayText(translate('delivery_window', {
                        '$delivery_window': capsDetails['delivery_window_' + lang],
                        '$chicken_number': chicken_number
                    }, lang));
                    global.promptDigits(confirmDeliveryWindowHandler.handlerName);
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