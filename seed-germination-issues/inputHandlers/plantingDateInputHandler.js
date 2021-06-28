var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');

var handlerName = 'rsgi_date';
module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var severityInputHandler = require('./severityInputHandler');
            var dateInput = input && input.split('/'); /// input should be dd/mm/yyyy
            var isValidDate = ((31 - parseInt(dateInput[0])) >= 0) && ((12 - parseInt(dateInput[1])) >= 0) && parseInt(dateInput[2]) >= 2020;
            var getMessage = translator(translations, lang);
            if(isValidDate) {
                state.vars.planting_date = input.trim();
                var severityPrompt = getMessage('severity', {}, lang);
                global.sayText(severityPrompt);
                global.promptDigits(severityInputHandler.handlerName);
            } else {
                // invalid option
                var date_screen = getMessage('planting_date', {}, lang);
                global.sayText(date_screen);
                global.promptDigits(handlerName);
            }    
        };
    }
};
