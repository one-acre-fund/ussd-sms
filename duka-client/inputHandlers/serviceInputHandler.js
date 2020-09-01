var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var dukaClientRegistration = require('../duka-client-registration/dukaClientRegistration');

var serviceHandlerName = 'select_service';
module.exports = {
    handlerName: serviceHandlerName,
    handler: function(input) {
        var lang = state.vars.lang;
        var getMessage = translator(translations, lang);
        var choice = input.replace(/\D/g, '');
        if(choice == 1) {
            // registration
            dukaClientRegistration.start();
            
        } else {
            // try again
            var retryScreen = getMessage('invalid_input', {'$Menu': state.vars.main_menu});
            sayText(retryScreen);
            promptDigits(serviceHandlerName, {
                maxDigits: 2,
                submitOnHash: false,
            });
        }
    }
};
