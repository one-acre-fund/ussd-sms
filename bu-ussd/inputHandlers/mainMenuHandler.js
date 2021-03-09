var registration = require('../registration/registration');
var checkBalance = require('../checkBalance/checkBalance');

var handlerName = 'main_menu_handler';

module.exports = {
    handlerName: handlerName,
    getHandler: function(language) {
        return function(input) {
            var main_screens = JSON.parse(state.vars.main_screens);
            var main_option_values = JSON.parse(state.vars.main_option_values);
            var current_main_screen = state.vars.current_main_screen;
            if(main_option_values[input]) {
                // the choice is valid
                if(main_option_values[input] === 'registration') {
                    // start registration
                    registration.start(language);
                } else if(main_option_values[input] === 'get_balance') {
                    // check balance
                    var client = JSON.parse(state.vars.client_json);
                    checkBalance(language, client);
                }
            } else {
                global.sayText(main_screens[current_main_screen]);
                global.promptDigits(handlerName);
            }
        };
    }
};
