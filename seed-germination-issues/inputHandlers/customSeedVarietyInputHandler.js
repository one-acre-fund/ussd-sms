var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');
var lotCodeInputHandler = require('./lotCodeInputHandler');
var handlerName = 'rsgi_custom_seed_variety';
module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var variety = input && input.trim();
            var getMessage = translator(translations, lang);
            if(!variety) {
                global.sayText(getMessage('custom_seed_variety', {}, lang));
                global.promptDigits(handlerName);
                return;
            }
            state.vars.rsgi_seed_variety = input;
            var lotCodePrompt = getMessage('lot_code', {}, lang);
            global.sayText(lotCodePrompt);
            global.promptDigits(lotCodeInputHandler.handlerName);
        };
    }
};
