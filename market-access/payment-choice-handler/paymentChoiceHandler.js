var handlerName = 'paymentChoiceHandler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

module.exports = {
    handlerName: handlerName,
    getHandler: function(onPaymentChoice){
        return function(input){
            notifyELK();
            if(input == '1' || input == '2' || input == '3'){
                onPaymentChoice(input);
            }else{
                var translate =  createTranslator(translations, state.vars.marketLang);
                global.sayText(translate('payment_choice',{},state.vars.marketLang));
                global.promptDigits(handlerName);

            }

        };

    }
};