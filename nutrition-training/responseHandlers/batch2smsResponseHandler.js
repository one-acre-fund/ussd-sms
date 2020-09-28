var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

var handlerName = '1.7sms';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function() {
            var choice = content && content.toUpperCase().trim();
            var getMessage = translator(translations, lang);
            var messageLabels;
            if(choice == 'A') {
                messageLabels = ['sms_1.7', 'sms_1.9', 'sms_2.1', 'sms_2.2'];
            } else if(choice == 'B') {
                messageLabels[0] = 'sms_1.8';
            } else {
                messageLabels = ['sms_1.7', 'sms_1.9', 'sms_2.1', 'sms_2.2'];
            }
            messageLabels.forEach(function(label) {
                global.sendReply(getMessage(label, {}, lang));
            });
        };
    }
};
