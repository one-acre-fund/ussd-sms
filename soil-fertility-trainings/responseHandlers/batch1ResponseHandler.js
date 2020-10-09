
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
                }]

            });

            global.waitForResponse(batch2ResponseHandler.handlerName);
        };
    }
};
