var handlerName = 'farmerSiteHandler';
var translations = require('../../translations');
var createTranslator = require('../../../utils/translator/translator');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');

module.exports = {
    handlerName: handlerName,
    getHandler: function(onSiteSubmitted){
        return function(input){
            notifyELK();
            if(typeof(input) != undefined && input != ''){
                onSiteSubmitted(input);
            }
            else{
                var translate =  createTranslator(translations, state.vars.marketLang);
                global.sayText(translate('farmers_site',{}));
                global.promptDigits(handlerName);
            }
        };
    }
};