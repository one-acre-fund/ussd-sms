var handlerName = 'confirmationHandler';
var notifyELK = require('../../notifications/elk-notification/elkNotification');

module.exports = {
    handlerName: handlerName,
    getHandler: function (onConfirmation){
        return function(input){
            notifyELK();
            if(input == '0'){
                onConfirmation(true);
            }
            else{
                onConfirmation(false);
            }
        };

    }
};