var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

var handlerName = 'main_menu';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            if(input == 1) {
                // start call the registration input handler
            } else {
                sayText(state.vars.main_menu);
                promptDigits(handlerName, {
                    maxDigits: 2,
                    submitOnHash: false,
                });
            }
        };
    }
};
