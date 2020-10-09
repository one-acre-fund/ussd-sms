
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

            project.sendMulti({
                messages: [
                    {
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
                    }
                ]
            });

            global.waitForResponse(batch7ResponseHandler.handlerName);
        };
    }
};
