
var handlerName = 'first_name_handler';
var notifyELK = require('../../notifications/elk-notification/elkNotification');
module.exports = {
    handlerName: handlerName,
    getHandler: function(onFirstNameReceived){
        return function (input) {
            notifyELK();
            onFirstNameReceived(input);
        };
    }
};