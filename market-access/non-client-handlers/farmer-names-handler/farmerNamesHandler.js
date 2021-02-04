var handlerName = 'farmerNamesHandler';
var translations = require('../../translations');
var createTranslator = require('../../../utils/translator/translator');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');

module.exports = {
    handlerName: handlerName,
    getHandler: function(onFNameSubmitted){
        return function(input){
            notifyELK();
            if(typeof(input) != undefined && input != ''){
                onFNameSubmitted(input);
            }
            else{
                var translate =  createTranslator(translations, state.vars.marketLang);
                global.sayText(translate('farmers_name',{}));
                global.promptDigits(handlerName);
            }
        };
    }
};