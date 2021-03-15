var registration = require('../registration/registration');
var checkBalance = require('../checkBalance/checkBalance');
var enrollment = require('../enrollment/enrollment');

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
                var client = JSON.parse(state.vars.client_json);
                if(main_option_values[input] === 'registration') {
                    // start registration
                    registration.start(language);
                } else if(main_option_values[input] === 'get_balance') {
                    // check balance
                    checkBalance(language, client);
                } else if(main_option_values[input] === 'place_order') {
                    // enrollment
                    enrollment.start(language, client);
                }
            } else {
                global.sayText(main_screens[current_main_screen]);
                global.promptDigits(handlerName);
            }
        };
    }
};
