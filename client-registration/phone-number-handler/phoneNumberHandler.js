var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');
var translate =  createTranslator(translations, state.vars.reg_lang ||'en-ke');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var isPhoneNumberValid = function(phoneNumber){
    // Valid for Kenya
    if(state.vars.country == 'ke' || state.vars.country == 'RW'){
        if (phoneNumber.length === 10 && phoneNumber.substring(0, 2)=='07'){
            return true;
        }
    }
    return false;
};
var handlerName = 'phone_number_handler';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onPhoneNumberValidated){
        return function (input) {
            notifyELK();
            if(isPhoneNumberValid(input)){
                onPhoneNumberValidated(input);
            }
            else{
                global.sayText(translate('invalid_phone_number'));
                global.promptDigits(handlerName);
            }  
        };

    }
};