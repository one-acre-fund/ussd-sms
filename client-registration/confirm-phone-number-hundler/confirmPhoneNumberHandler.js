var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');
var translate =  createTranslator(translations, project.vars.lang);
var phoneNumberHandler = require('../phone-number-handler/phoneNumberHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var handlerName = 'confirm_ph_nber';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onPhoneNumberConfirmed){
        return function (input) {  
            notifyELK();
            if(input == 1){
                onPhoneNumberConfirmed();
            }
            else{
                global.sayText(translate('phone_number_prompt',{},state.vars.reg_lang));
                global.promptDigits(phoneNumberHandler.handlerName);
            }
        };
    }
};