var handlerName = 'order_cfrm_handler_enr';
var notifyELK = require('../../notifications/elk-notification/elkNotification');
module.exports = {
    handlerName: handlerName,
    getHandler: function(onOrderConfirmed){
        return function (input) {
            notifyELK();
            if(input == 1){
                onOrderConfirmed();
            }
        };
    }
};