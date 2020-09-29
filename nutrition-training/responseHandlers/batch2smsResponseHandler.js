var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

var handlerName = 'nutrition_batch2';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function() {
            var choice = content && content.toUpperCase().trim();
            var getMessage = translator(translations, lang);
            var messageLabels = ['sms_1.9', 'sms_2.1', 'sms_2.2'];
            if(choice == 'A') {
                messageLabels.unshift('sms_1.7');
            } else if(choice == 'B' || choice == 'C') {
                messageLabels.unshift('sms_1.8');
            } else {
                global.sendReply(getMessage('invalid_choice', {}, lang));
                global.waitForResponse(handlerName);
                return;
            }
            messageLabels.forEach(function(label) {
                global.sendReply(getMessage(label, {}, lang));
            });
        };
    }
};
