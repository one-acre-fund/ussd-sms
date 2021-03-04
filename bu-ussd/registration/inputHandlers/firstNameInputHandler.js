var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var lastNameInputHandler = require('./lastNameInputHandler');

var handlerName = 'bu_reg_first_name';

module.exports = {
    handlerName: handlerName,
    getHandler: function(language) {
        return function(input) {
            var getMessage = translator(translations, language);
            state.vars.first_name = input;
            global.sayText(getMessage('last_name'));
            global.promptDigits(lastNameInputHandler.handlerName);
        };
    }
};
