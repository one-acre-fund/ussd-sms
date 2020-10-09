
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

var HandlerName = 'sms_4_response';
module.exports = {
    handlerName: HandlerName,
    getHandler: function(lang) {
        return function() {
            var batch5ResponseHandler = require('./batch5ResponseHandler');
            var getMessage = translator(translations, lang);
            var messages = ['sms-5.1', 'sms-5.2', 'sms-5.3', 'sms-5.4', 'sms-5.5'];

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
                    },                     {
                        'content': getMessage(messages[4], {}, lang),
                        'to_number': contact.phone_number,
                        'priority': 1,
                    }
                ]
            });

            global.waitForResponse(batch5ResponseHandler.handlerName);
        };
    }
};
