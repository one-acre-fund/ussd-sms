var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var handlerName = 'dateAvailableHandler';
var moment = require('moment');

function isValidDate(date){
    var selectedDate = moment(date,'DD-MM-YYYY');
    if(selectedDate.isValid)
        return selectedDate > moment(Date.now());
    return false;
}
module.exports = {
    handlerName: handlerName,
    getHandler: function(onDateSubmitted){
        return function(input){
            if(typeof(input) != 'undefined' && isValidDate(input)){
                onDateSubmitted(input);
            }
            else{
                var translate =  createTranslator(translations, state.vars.marketLang);
                global.sayText(translate('maize_availability',{}));
                global.promptDigits(handlerName);
            }   
        };
    }
};
