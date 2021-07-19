var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');

var handlerName = 'rsgi_issues_severity';
var issueLevels = {
    1: '0-0.25%',
    2: '26-50%',
    3: '51-75%',
    4: '76-100%'
};
module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var phoneNumberInputHandler = require('./phoneNumberInputHandler');
            var issueLevel = input && parseInt(input.replace(/\D/g, ''));
            var getMessage = translator(translations, lang);
            if((typeof issueLevel) === 'number' && issueLevels[issueLevel]) {
                state.vars.issues_severity = issueLevels[issueLevel];
                call.vars.issues_severity = issueLevels[issueLevel];
                global.sayText(getMessage('phone_prompt', {}, lang));
                global.promptDigits(phoneNumberInputHandler.handlerName);
            } else {
                // invalid option
                global.sayText(getMessage('severity', {}, lang));
                global.promptDigits(handlerName);
            }
        };
    }
};
