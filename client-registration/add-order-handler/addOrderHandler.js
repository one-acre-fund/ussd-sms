var handlerName = 'add_order_handler_enr';
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var bundleChoiceHandler = require('../bundle-choice-handler/bundleChoiceHandler');
module.exports = {
    handlerName: handlerName,
    getHandler: function(onFinalizeOrder,displayBundles){
        return function (input) {
            notifyELK();
            if(input == 1){
                displayBundles(JSON.parse(state.vars.newClient).DistrictId);
                global.promptDigits(bundleChoiceHandler.handlerName);
            }
            else if(input == 2){
                onFinalizeOrder();

            }
            else if(input == 3){
                var orders = JSON.parse(state.vars.orders);
                orders.pop();
                state.vars.orders = JSON.stringify(orders);
                displayBundles(JSON.parse(state.vars.newClient).DistrictId);
                global.promptDigits(bundleChoiceHandler.handlerName);

            }
        };
    }
};