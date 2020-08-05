var notifyELK = require('../../notifications/elk-notification/elkNotification');
var handlerName = 'transaction_select_handler';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onTransactionSelected){
        return function (input) {
            notifyELK();
            onTransactionSelected(input);
        };
    }
};