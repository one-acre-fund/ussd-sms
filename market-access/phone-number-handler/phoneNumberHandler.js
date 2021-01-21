var handlerName = 'MAPhoneHandler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

function isValidPhone(input){
    if(input.length === 10 && input.substring(0, 2)=='07')
        return true;
    return false;

}
module.exports = {
    handlerName: handlerName,
    getHandler: function(onPhoneSubmitted){
        return function(input){
            notifyELK();
            if(isValidPhone(input)){
                onPhoneSubmitted(input);
            }
            else{
                var translate =  createTranslator(translations, state.vars.marketLang);
                global.sayText(translate('phone_number_menu',{}));
                global.promptDigits(handlerName);
            }
        };
    }
};