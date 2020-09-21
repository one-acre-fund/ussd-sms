var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var secondNameInputHandler = require('./secondNameInputHandler');

var handlerName = 'duka_client_registration_firstName';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var getMessage = translator(translations, lang);
            state.vars.duka_client_first_name = input;
            var secondNamePrompt = getMessage('enter_second_name');
            global.sayText(secondNamePrompt);
            global.promptDigits(secondNameInputHandler.handlerName);
        };
    }
};
