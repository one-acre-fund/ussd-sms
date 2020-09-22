var registration = require('../registration/registration');

var handlerName = 'duka_client_registration_main_menu';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            if(input == 1) {
                registration.start(lang);
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
