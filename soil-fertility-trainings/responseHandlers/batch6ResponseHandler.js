
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var batch7ResponseHandler = require('./batch7ResponseHandler');

var HandlerName = 'sms_6_response';
module.exports = {
    handlerName: HandlerName,
    getHandler: function(lang) {
        return function() {

            var getMessage = translator(translations, lang);
            var messages = ['sms-6.1', 'sms-6.2', 'sms-6.3', 'sms-6.4'];

            messages.forEach(function(message) {
                sendReply(getMessage(message, {}, lang));
            });
            waitForResponse(batch7ResponseHandler.handlerName);
        };
    }
};
