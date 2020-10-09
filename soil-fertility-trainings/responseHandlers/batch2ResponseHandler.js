
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

            project.sendMulti({
                messages: [{
                    'content': getMessage(messages[0], {}, lang),
                    'to_number': contact.phone_number,
                    'priority': 2,
                },
                {
                    'content': getMessage(messages[1], {}, lang),
                    'to_number': contact.phone_number,
                    'priority': 2,
                },
                {
                    'content': getMessage(messages[2], {}, lang),
                    'to_number': contact.phone_number,
                    'priority': 2,
                },
                {
                    'content': getMessage(messages[3], {}, lang),
                    'to_number': contact.phone_number,
                    'priority': 2,
                },
                {
                    'content': getMessage(messages[4], {}, lang),
                    'to_number': contact.phone_number,
                    'priority': 2,
                }]

            });

            global.waitForResponse(batch3ResponseHandler.handlerName);
        };
    }
};
