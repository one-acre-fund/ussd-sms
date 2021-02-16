var handlerName = 'nonClientIdHandler';
var translations = require('../../translations');
var createTranslator = require('../../../utils/translator/translator');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');

module.exports = {
    handlerName: handlerName,
    getHandler: function(onNationalIdSubmitted){
        return function(input){
            notifyELK();
            if(typeof(input) != undefined && input != ''){
                onNationalIdSubmitted(input);
            }
            else{
                var translate =  createTranslator(translations, state.vars.marketLang);
                global.sayText(translate('national_id_menu',{}));
                global.promptDigits(handlerName);
            }
        };
    }
};