
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

var HandlerName = 'sms_3_response';
module.exports = {
    handlerName: HandlerName,
    getHandler: function(lang) {
        return function() {
            var batch4ResponseHandler = require('./batch4ResponseHandler');
            var getMessage = translator(translations, lang);
            var messages = ['sms-4.1', 'sms-4.2', 'sms-4.3', 'sms-4.4', 'sms-4.5', 'sms-4.6', 'sms-4.7', 'sms-4.8', 'sms-4.9', 'sms-4.01'];

            global.sendReply(getMessage(messages[0], {}, lang));
            global.sendReply(getMessage(messages[1], {}, lang));
            global.sendReply(getMessage(messages[2], {}, lang));
            global.sendReply(getMessage(messages[3], {}, lang));
            global.sendReply(getMessage(messages[4], {}, lang));
            global.sendReply(getMessage(messages[5], {}, lang));
            global.sendReply(getMessage(messages[6], {}, lang));
            global.sendReply(getMessage(messages[7], {}, lang));
            global.sendReply(getMessage(messages[8], {}, lang));
            global.sendReply(getMessage(messages[9], {}, lang));

            global.waitForResponse(batch4ResponseHandler.handlerName);
        };
    }
};
