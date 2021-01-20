var handlerName = 'quantityHandler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');

function isValidPhone(input){
    if(input.length == 10)
        return true;
    return false;

}
module.exports = {
    handlerName: handlerName,
    getHandler: function(onPhoneSubmitted){
        return function(input){
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