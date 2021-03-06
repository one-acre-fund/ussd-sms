var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var notifyElk = require('../../../notifications/elk-notification/elkNotification');

var handlerName = 'dcr_firstName';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            input = input.replace(/[^a-zA-Z0-9]/gi, '');
            notifyElk();
            var getMessage = translator(translations, lang);
            if(!input) {
                global.sayText(getMessage('enter_first_name', {}, lang));
                global.promptDigits(handlerName);
                return;
            }
            var secondNameInputHandler = require('./secondNameInputHandler');
            state.vars.duka_client_first_name = input;
            var secondNamePrompt = getMessage('enter_second_name', {}, lang);
            global.sayText(secondNamePrompt);
            global.promptDigits(secondNameInputHandler.handlerName);
        };
    }
};
