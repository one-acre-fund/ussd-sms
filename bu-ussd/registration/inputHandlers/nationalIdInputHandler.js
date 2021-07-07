var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var firstNameInputHandler = require('./firstNameInputHandler');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');

var handlerName = 'bu_reg_national_id';

module.exports = {
    handlerName: handlerName,
    getHandler: function(language) {
        return function(input) {
            notifyELK();
            var getMessage = translator(translations, language);
            state.vars.national_id = input;
            global.sayText(getMessage('first_name'));
            global.promptDigits(firstNameInputHandler.handlerName);
        };
    }
};
