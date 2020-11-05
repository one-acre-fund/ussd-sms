var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');
var lotCodeInputHandler = require('./lotCodeInputHandler');

var handlerName = 'rsgi_custom_seed_variety';
module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var getMessage = translator(translations, lang);
            state.vars.rsgi_seed_variety = input;
            var lotCodePrompt = getMessage('lot_code', {}, lang);
            global.sayText(lotCodePrompt);
            global.promptDigits(lotCodeInputHandler.handlerName);
        };
    }
};
