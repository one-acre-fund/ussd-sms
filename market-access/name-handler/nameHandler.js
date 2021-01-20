var handlerName = 'MANameHandler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');

module.exports = {
    handlerName: handlerName,
    getHandler: function(onNameSubmitted){
        return function(input){
            if(typeof(input) != undefined){
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