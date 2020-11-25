var handlerName = 'order_confirmation_handler';
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var bundleChoiceHandler = require('../bundle-choice-handler/bundleChoiceHandler');
module.exports = {
    handlerName: handlerName,
    getHandler: function(onOrderConfirmed, displayBundles){
        return function (input) {
            notifyELK();
            if(input == 1){
                onOrderConfirmed();
            }
            else if(input == 2){
                var orders = JSON.parse(state.vars.orders);
                orders.pop();
                state.vars.orders = JSON.stringify(orders);
                displayBundles(JSON.parse(state.vars.topUpClient).DistrictId);
                global.promptDigits(bundleChoiceHandler.handlerName);
            }
        };
    }
};