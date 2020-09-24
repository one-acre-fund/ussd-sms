var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var notifyElk = require('../../../notifications/elk-notification/elkNotification');

var handlerName = 'dcr_firstName';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            notifyElk();
            var secondNameInputHandler = require('./secondNameInputHandler');
            var getMessage = translator(translations, lang);
            state.vars.duka_client_first_name = input;
            var secondNamePrompt = getMessage('enter_second_name', {}, lang);
            global.sayText(secondNamePrompt);
            global.promptDigits(secondNameInputHandler.handlerName);
        };
    }
};
