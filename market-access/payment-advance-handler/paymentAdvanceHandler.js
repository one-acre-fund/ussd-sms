var handlerName = 'paymentAdvanceHandler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

module.exports = {
    handlerName: handlerName,
    getHandler: function(onAdvancePayment){
        return function(input){
            notifyELK();
            if(input == '1' || input == '2'){
                onAdvancePayment(input);

            }else{
                var translate =  createTranslator(translations, state.vars.marketLang);
                global.sayText(translate('payment_advance',{}));
                global.promptDigits(handlerName);

            }
        };
    }
};