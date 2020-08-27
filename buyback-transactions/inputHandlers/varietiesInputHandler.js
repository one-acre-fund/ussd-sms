var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var kgsHandler = require('./kgsInputHandler');

var varietiesHandlerName = 'varieties';

module.exports = {
    handlerName: varietiesHandlerName,
    handler: function(input) {
        var lang = state.vars.lang;
        var getMessage = translator(translations, lang);

        var varieties = JSON.parse(state.vars.varieties);
        var variety = varieties[input.replace(/\D/g, '')];
        if(variety){
            state.vars.selected_variety = JSON.stringify(variety);
            sayText(getMessage('kgs', {}, lang));
            promptDigits(kgsHandler.handlerName, {
                submitOnHash: false,
                timeout: 5,
                maxDigits: 1
            });
        } else {
            var varietiesMenu = state.vars.varieties_menu;
            var retryMenu = getMessage('invalid_input_try_again', {'$Menu': varietiesMenu}, lang);
            sayText(retryMenu);
            promptDigits(varietiesHandlerName, {
                submitOnHash: false,
                timeout: 5,
                maxDigits: 1
            });
        }
    }
};
