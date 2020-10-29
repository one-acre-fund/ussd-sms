var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');
var customSeedVarietyInputHandler = require('./customSeedVarietyInputHandler');

var handlerName = 'rsgi_custom_seed_brand';
module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var getMessage = translator(translations, lang);
            state.vars.rsgi_seed_brand = input;
            var seed_variety_prompt = getMessage('custom_seed_variety');
            global.sayText(seed_variety_prompt);
            global.promptDigits(customSeedVarietyInputHandler.handlerName);
        };
    }
};
