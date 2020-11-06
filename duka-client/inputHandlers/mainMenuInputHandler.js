var registration = require('../registration/registration');
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

var handlerName = 'dcr_main_menu';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var getMessage = translator(translations, lang);
            if(input == 1) {
                registration.start(lang);
            } else {
                sayText(getMessage('register_client', {'$label': 1}, lang));
                promptDigits(handlerName, {
                    maxDigits: 2,
                    submitOnHash: false,
                });
            }
        };
    }
};
