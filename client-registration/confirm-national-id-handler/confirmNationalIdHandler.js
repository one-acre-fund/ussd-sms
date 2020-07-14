var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');
var translate =  createTranslator(translations, project.vars.lang);
var nationalIdHandler = require('../national-id-handler/nationalIdHandler')
var handlerName = 'confirm_national_id';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onPhoneNumberConfirmed){
        return function (input) {  
            if(input == 1){
                onPhoneNumberConfirmed();
            }
            else{
                global.sayText(translate('national_id_handler'));
                global.promptDigits(nationalIdHandler.handlerName);
            }

        };

    }
};