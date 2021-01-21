var handlerName = 'confirmationHandler';
var notifyELK = require('../../notifications/elk-notification/elkNotification');

module.exports = {
    handlerName: handlerName,
    getHandler: function (onConfirmation){
        return function(input){
            notifyELK();
            if(typeof(input) != undefined){
                onConfirmation(input);
            }
            else{
                onConfirmation(false);
            }
        };

    }
};