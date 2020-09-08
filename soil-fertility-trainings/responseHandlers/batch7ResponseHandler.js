
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

var HandlerName = 'sms_7_response';
module.exports = {
    handlerName: HandlerName,
    getHandler: function(lang) {
        return function() {

            var getMessage = translator(translations, lang);
            var messages = ['sms-7.1', 'sms-7.2'];

            messages.forEach(function(message) {
                sendReply(getMessage(message, {}, lang));
            });
        };
    }
};
