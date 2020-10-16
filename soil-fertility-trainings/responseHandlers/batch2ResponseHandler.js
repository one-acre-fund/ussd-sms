
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

var batch1HandlerName = 'sms_2_response';
module.exports = {
    handlerName: batch1HandlerName,
    getHandler: function(lang) {
        return function() {   
            var batch3ResponseHandler = require('./batch3ResponseHandler');
            var getMessage = translator(translations, lang);
            var messages = ['sms-3.1', 'sms-3.2', 'sms-3.3', 'sms-3.4', 'sms-3.5'];
            var start_time_offset = 0;
            messages.forEach(function(message) {
                project.scheduleMessage({
                    content: getMessage(message, {}, lang),
                    to_number: contact.phone_number,
                    start_time_offset: start_time_offset
                });
                start_time_offset +=15;
            });

            global.waitForResponse(batch3ResponseHandler.handlerName);
        };
    }
};
