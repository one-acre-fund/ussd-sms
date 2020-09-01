var handlerName = 'order_confirmation_handler';
//var translations = require('../translations');
//var createTranslator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
//var translate =  createTranslator(translations, project.vars.lang);
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