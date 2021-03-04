var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var phoneNumberInputHandler = require('./phoneNumberInputHandler');
var handlerName = 'bu_reg_last_name';

module.exports = {
    handlerName: handlerName,
    getHandler: function(language) {
        return function(input) {
            var getMessage = translator(translations, language);
            state.vars.last_name = input;
            global.sayText(getMessage('client_phone_number'));
            global.promptDigits(phoneNumberInputHandler.handlerName);
        };
    }
};
