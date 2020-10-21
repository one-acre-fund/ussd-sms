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
            var messages;
            if(choice == 'A') {
                messages = ['sms_1.3', 'sms_1.6'];
            } else if(choice == 'B' || choice == 'C') {
                messages = ['sms_1.4', 'sms_1.5', 'sms_1.6'];
            } else {
                global.sendReply(getMessage('invalid_choice', {}, lang));
                global.waitForResponse(handlerName);
                return;
            }
            var start_time_offset = 0;
            messages.forEach(function(message) {
                project.scheduleMessage({
                    content: getMessage(message, {}, lang),
                    to_number: contact.phone_number,
                    start_time_offset: start_time_offset
                });
                start_time_offset +=15;
            });
            global.waitForResponse(batch2_smsHandler.handlerName);
        };
    }
};
