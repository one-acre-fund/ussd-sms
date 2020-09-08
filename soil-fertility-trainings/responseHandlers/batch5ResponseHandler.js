
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var batch6ResponseHandler = require('./batch6ResponseHandler');

var HandlerName = 'sms_5_response';
module.exports = {
    handlerName: HandlerName,
    getHandler: function(lang) {
        return function() {

            var getMessage = translator(translations, lang);
            var response = content.trim().toUpperCase();

            if(response == 'A') {
                sendReply(getMessage('sms-5.6', {}, lang));
            } else if(response == 'B') {
                sendReply(getMessage('sms-5.7', {}, lang));
            } else {
                sendReply(getMessage('invalid_rotate_answer', {}, lang));
                waitForResponse(HandlerName);
                return;
            }
            waitForResponse(batch6ResponseHandler.handlerName);
        };
    }
};
