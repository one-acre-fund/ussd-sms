var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');

var handlerName = 'rsgi_month';
module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var dukaInputHandler = require('./dukaInputHandler');
            var dateInputHandler = require('./plantingDateInputHandler');
            input = input.replace(/\D/g, '');
            var getMessage = translator(translations, lang);
            var months_option_values = JSON.parse(state.vars.months);
            var months_screens = JSON.parse(state.vars.months_screens); 
            var months = dukaInputHandler.months[lang];
            var chosenOption = months_option_values[input];
            var chosenMonth = months[chosenOption];

            if(chosenMonth) {
                state.vars.chosen_month = chosenOption;
                var date = getMessage('planting_date', {}, lang);
                global.sayText(date);
                global.promptDigits(dateInputHandler.handlerName);
            } else if(input == 77 && months_screens[state.vars.current_months_menu + 1]) {
                // next page
                state.vars.current_months_menu +=1;
                global.sayText(months_screens[state.vars.current_months_menu]);
                global.promptDigits(handlerName);
            } else {
                // wrong option
                global.sayText(months_screens[state.vars.current_months_menu]);
                global.promptDigits(handlerName);
            }
        };
    }
};
