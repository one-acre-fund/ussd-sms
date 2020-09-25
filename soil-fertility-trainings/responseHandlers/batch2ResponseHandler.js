
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

            messages.forEach(function(message) {
                global.sendReply(getMessage(message, {}, lang));
            });

            global.waitForResponse(batch3ResponseHandler.handlerName);
        };
    }
};
