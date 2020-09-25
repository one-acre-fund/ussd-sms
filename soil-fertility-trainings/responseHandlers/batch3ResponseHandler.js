
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

            messages.forEach(function(message) {
                global.sendReply(getMessage(message, {}, lang));
            });

            global.waitForResponse(batch4ResponseHandler.handlerName);
        };
    }
};
