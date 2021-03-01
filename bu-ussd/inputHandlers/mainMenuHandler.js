var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var handlerName = 'main_menu_handler';

module.exports = {
    handlerName: handlerName,
    getHandler: function(language) {
        return function(input) {
            var main_screens = JSON.parse(state.main_screens);
            var main_option_values = JSON.parse(state.main_option_values);
            var current_main_screen = state.vars.current_main_screen;

            if(main_option_values[input]) {
                // the choice is valid
            } else {
                var mainMenuHandler = require('../inputHandlers/mainMenuHandler');
                global.sayText(main_screens[current_main_screen]);
                global.promptDigits(mainMenuHandler.handlerName);
            }
        };
    }
};
