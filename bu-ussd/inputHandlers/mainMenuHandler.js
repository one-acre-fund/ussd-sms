var registration = require('../registration/registration');
var checkBalance = require('../checkBalance/checkBalance');
var preEnrollmentHandler = require('./preEnrollmentHandler');
var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');

var handlerName = 'main_menu_handler';

module.exports = {
    handlerName: handlerName,
    getHandler: function(language) {
        return function(input) {
            var main_screens = JSON.parse(state.vars.main_screens);
            var main_option_values = JSON.parse(state.vars.main_option_values);
            var current_main_screen = state.vars.current_main_screen;
            var getMessage = translator(translations, language);
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
                    // ask for an account number of a farmer being enrolled
                    global.sayText(getMessage('account_to_be_enrolled'));
                    global.promptDigits(preEnrollmentHandler.handlerName);
                }
            } else {
                global.sayText(main_screens[current_main_screen]);
                global.promptDigits(handlerName);
            }
        };
    }
};
