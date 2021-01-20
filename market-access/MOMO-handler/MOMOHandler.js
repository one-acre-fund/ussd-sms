var handlerName = 'MOMOHandler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

module.exports = {
    handlerName: handlerName,
    getHandler: function(onMOMOChosen){
        return function(input){
            notifyELK();
            if(input == '1' || input == '2'){
                onMOMOChosen(input);
            }else{
                var translate =  createTranslator(translations, state.vars.marketLang);
                global.sayText(translate('MOMO_choice',{}));
                global.promptDigits(handlerName);
            }
        };
    }
};