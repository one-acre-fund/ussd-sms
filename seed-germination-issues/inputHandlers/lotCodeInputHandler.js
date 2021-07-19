var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');

var handlerName = 'rsgi_lot_code';
module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var dukaInputHandler = require('./dukaInputHandler');
            var getMessage = translator(translations, lang);
            state.vars.lot_code = input;
            global.sayText(getMessage('duka_title', {}, lang));
            global.promptDigits(dukaInputHandler.handlerName);
        };
    }
};
