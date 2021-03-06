
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

var HandlerName = 'sms_6_response';
module.exports = {
    handlerName: HandlerName,
    getHandler: function(lang) {
        return function() { 
            var batch7ResponseHandler = require('./batch7ResponseHandler');
            var getMessage = translator(translations, lang);
            var messages = ['sms-6.1', 'sms-6.2', 'sms-6.3', 'sms-6.4'];

            var start_time_offset = 0;
            messages.forEach(function(message) {
                project.scheduleMessage({
                    content: getMessage(message, {}, lang),
                    to_number: contact.phone_number,
                    start_time_offset: start_time_offset
                });
                start_time_offset +=15;
            });

            global.waitForResponse(batch7ResponseHandler.handlerName);
        };
    }
};
