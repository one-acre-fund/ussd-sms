var handlerName = 'farmerDistrictHandler';
var translations = require('../../translations');
var createTranslator = require('../../../utils/translator/translator');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');

module.exports = {
    handlerName: handlerName,
    getHandler: function(onDistrictSubmitted){
        return function(input){
            notifyELK();
            if(typeof(input) != undefined && input != ''){
                onDistrictSubmitted(input);
            }
            else{
                var translate =  createTranslator(translations, state.vars.marketLang);
                global.sayText(translate('farmers_district',{}));
                global.promptDigits(handlerName);
            }
        };
    }
};