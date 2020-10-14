
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

var batch1HandlerName = 'sms_1_response';
module.exports = {
    handlerName: batch1HandlerName,
    getHandler: function(lang) {
        return function() {   
            var batch2ResponseHandler = require('./batch2ResponseHandler');
            var getMessage = translator(translations, lang);
            var messages = ['sms-2.1', 'sms-2.2', 'sms-2.3', 'sms-2.4'];
            var start_time_offset = 0;
            messages.forEach(function(message) {
                project.scheduleMessage({
                    content: getMessage(message, {}, lang),
                    to_number: contact.phone_number,
                    start_time_offset: start_time_offset
                });
                start_time_offset +=15;
            });

            global.waitForResponse(batch2ResponseHandler.handlerName);
        };
    }
};
