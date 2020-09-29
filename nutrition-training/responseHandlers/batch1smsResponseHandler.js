var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

var handlerName = 'nutrition_batch1';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function() {
            var batch2_smsHandler = require('./batch2smsResponseHandler');
            var choice = content && content.toUpperCase().trim();
            var getMessage = translator(translations, lang);
            var messageLabels;
            if(choice == 'A') {
                messageLabels = ['sms_1.3', 'sms_1.6'];
            } else if(choice == 'B' || choice == 'C') {
                messageLabels = ['sms_1.4', 'sms_1.5', 'sms_1.6'];
            } else {
                global.sendReply(getMessage('invalid_choice', {}, lang));
                global.waitForResponse(handlerName);
                return;
            }
            messageLabels.forEach(function(label) {
                global.sendReply(getMessage(label, {}, lang));
            });
            global.waitForResponse(batch2_smsHandler.handlerName);
        };
    }
};
