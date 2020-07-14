var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');
var translate =  createTranslator(translations, project.vars.lang);
phoneNumberHandler = require('../phone-number-handler/phoneNumberHandler');

var handlerName = 'confirm_ph_nber';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onNationalIdConfirmation){
        return function (input) {  
            if(input == 1){
                onNationalIdConfirmation();
            }
            else{
                global.sayText(translate('phone_number_prompt'));
                global.promptDigits(phoneNumberHandler.handlerName);
            }
        };
    }
};