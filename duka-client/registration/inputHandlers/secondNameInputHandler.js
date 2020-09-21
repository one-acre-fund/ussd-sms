var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var confirmFirstSecondName = require('./confirmFirstSecondNameInputHandler');

var handlerName = 'duka_client_registration_secondName';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var getMessage = translator(translations, lang);
            state.vars.duka_client_second_name = input;
            var confirmNamesMessageTitle = getMessage('first_sencond_name_confirm', {
                '$first_name': state.vars.duka_client_first_name,
                '$second_name': input
            }, lang);

            var confirmNamesMessage = confirmNamesMessageTitle + getMessage('confirm_or_try', {}, lang);
            global.sayText(confirmNamesMessage);
            global.promptDigits(confirmFirstSecondName.handlerName);
        };
    }
};
