var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');
var lotCodeInputHandler = require('./lotCodeInputHandler');

var handlerName = 'rsgi_seed_variety';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var getMessage = translator(translations, lang);
            input = input.replace(/\D/g, '');
            var varieties_option_values = JSON.parse(state.vars.varieties_option_values);
            var varieties_screens = JSON.parse(state.vars.varieties_screens);

            var chosenOption = varieties_option_values[input];
            if(chosenOption) {
                state.vars.rsgi_seed_variety = chosenOption;
                var lotCodePrompt = getMessage('lot_code', {}, lang);
                global.sayText(lotCodePrompt);
                global.promptDigits(lotCodeInputHandler.handlerName);
            } else if(input == 99 && varieties_screens[state.vars.current_varieties_screen + 1]) {
                // display next screen
                state.vars.current_varieties_screen += 1;
                global.sayText(varieties_screens[state.vars.current_varieties_screen]);
                global.promptDigits(handlerName);
                
            } else {
                // have choosen an invalid option
                global.sayText(varieties_screens[state.vars.current_varieties_screen]);
                global.promptDigits(handlerName);
            }
        };
    }
};
