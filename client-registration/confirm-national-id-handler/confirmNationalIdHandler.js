var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');
var translate =  createTranslator(translations, project.vars.lang);
var nationalIdHandler = require('../national-id-handler/nationalIdHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var handlerName = 'confirm_national_id';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onNationalIdConfirmation){
        return function (input) { 
            notifyELK(); 
            if(input == 1){
                onNationalIdConfirmation();
            }
            else{
                global.sayText(translate('national_id_handler',{},state.vars.reg_lang));
                global.promptDigits(nationalIdHandler.handlerName);
            }

        };

    }
};