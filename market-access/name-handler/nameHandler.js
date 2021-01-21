var handlerName = 'MANameHandler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

module.exports = {
    handlerName: handlerName,
    getHandler: function(onNameSubmitted){
        return function(input){
            notifyELK();
            if(typeof(input) != undefined && input != ''){
                onNameSubmitted(input);
            }
            else{
                var translate =  createTranslator(translations, state.vars.marketLang);
                global.sayText(translate('farmer_name_menu',{}));
                global.promptDigits(handlerName);
            }
        };
    }
};