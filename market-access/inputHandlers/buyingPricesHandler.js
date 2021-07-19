var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var marketAccessHandler = require('./marketAccessHandler');

var handlerName = 'oaf_byng_prcs_handler';
module.exports  = {
    handlerName: handlerName,
    getHandler: function(){
        return function(input) {
            var lang =state.vars.marketLang;
            if(input == 1) {
                //
                global.sayText(translate('oaf_maize_price', {'$maize_price': project.vars.maize_price || service.vars.maize_price}, lang));
                global.stopRules();
            } else if(input == 0){
                // go back to the previous state ()
                global.sayText(translate('market_access_menu', {}, lang));
                global.promptDigits(marketAccessHandler.handlerName);
            } else {
                // reprompt
                global.sayText(translate('oaf_buying_prices', {}, lang));
                global.promptDigits(handlerName);
            }
        };
    }
};
