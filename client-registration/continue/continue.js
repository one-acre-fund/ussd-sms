var notifyELK = require('../../notifications/elk-notification/elkNotification');
var handlerName = 'continue-enrollment';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onContinueToEnroll){
        return function (input) {  
            notifyELK();
            if(input == 1){
                onContinueToEnroll();
            }
            else{
                stopRules();
            }
        };
    }
};