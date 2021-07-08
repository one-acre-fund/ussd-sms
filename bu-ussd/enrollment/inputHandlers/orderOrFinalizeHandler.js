var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');

var handlerName = 'bu_enr_order_or_finalize';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang, onOrderOrFinaliseSelected) {
        return function(input) {
            var getMessage = translator(translations, lang);
            if(!input) {
                global.sayText(getMessage('order_or_finalize', {}, lang));
                global.promptDigits(handlerName);
                return;
            }
            input = input.trim();
            if(input == 1 || input == 2) {
                onOrderOrFinaliseSelected(lang, input);
            } else {
                // wrong input (reprompt)
                global.sayText(getMessage('order_or_finalize', {}, lang));
                global.promptDigits(handlerName);
            }
        };
    }
};
