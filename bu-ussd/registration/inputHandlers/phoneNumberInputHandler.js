var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var groupCodeInputHandler = require('./groupCodeInputHandler');

var handlerName = 'bu_reg_phone_number';

module.exports = {
    handlerName: handlerName,
    getHandler: function(language) {
        return function(input) {
            var getMessage = translator(translations, language);

            function invalidPhone() {
                // invalid input. reprompt
                global.sayText(getMessage('invalid_phone'));
                global.promptDigits(handlerName);
            }

            if(!input || !input.replace(/\D/g, '')) {
                invalidPhone();
                return;
            }
            var phoneNumber = input.replace(/\D/g, '');
            if(phoneNumber == '0') {
                // farmer has no phone. user the current session's at the moment
                phoneNumber = contact.phone_number;
            } else if((phoneNumber && (phoneNumber.length < 8 || phoneNumber.length > 12))){
                // invalid phone reprompt
                invalidPhone();
                return;
            }
            state.vars.phone_number = phoneNumber;
            global.sayText(getMessage('group_code'));
            global.promptDigits(groupCodeInputHandler.handlerName);
        };
    }
};
