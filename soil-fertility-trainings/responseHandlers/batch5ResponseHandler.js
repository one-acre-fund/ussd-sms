
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

var HandlerName = 'sms_5_response';
module.exports = {
    handlerName: HandlerName,
    getHandler: function(lang) {
        return function() {
            var batch6ResponseHandler = require('./batch6ResponseHandler');
            var getMessage = translator(translations, lang);
            var response = content.trim().toUpperCase();

            if(response == 'A') {
                global.sendReply(getMessage('sms-5.6', {}, lang));
            } else if(response == 'B') {
                global.sendReply(getMessage('sms-5.7', {}, lang));
            } else {
                global.sendReply(getMessage('invalid_rotate_answer', {}, lang));
                global.waitForResponse(HandlerName);
                return;
            }
            global.waitForResponse(batch6ResponseHandler.handlerName);
        };
    }
};
