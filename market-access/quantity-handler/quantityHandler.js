var handlerName = 'quantityHandler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

module.exports = {
    handlerName: handlerName,
    getHandler: function(onQuantitySubmitted){
        return function(input){
            notifyELK();
            if(input %100 == 0){
                onQuantitySubmitted(input);
            }
            else{
                var translate =  createTranslator(translations, state.vars.marketLang);
                global.sayText(translate('quantity_unshield_maize',{}));
                global.promptDigits(handlerName);
            }   
        };
    }
};