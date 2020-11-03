var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');
var phoneNumberInputHandler = require('./phoneNumberInputHandler');

var handlerName = 'rsgi_week';
var week_options = {1: 'first week', 2: 'second week', 3: 'third week', 4: 'fourth'};
module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            input = input.replace(/\D/g, '');
            var getMessage = translator(translations, lang);
            if(week_options[input]) {
                state.vars.week_number = input;
                var phoneNumberPrompt = getMessage('phone_prompt', {}, lang);
                global.sayText(phoneNumberPrompt);
                global.promptDigits(phoneNumberInputHandler.handlerName);
            } else {
                // invalid option
                var weeks_screen = getMessage('planting_week', {'$month': state.vars.chosen_month});
                global.sayText(weeks_screen);
                global.promptDigits(handlerName);
            }
        };
    }
};
