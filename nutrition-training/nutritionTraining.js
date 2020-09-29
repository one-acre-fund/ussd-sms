var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var batch1smsResponseHandler = require('./responseHandlers/batch1smsResponseHandler');

module.exports = function(lang) {
    var getMessage = translator(translations, lang);

    var messages = ['sms_1.1', 'sms_1.2'];
    project.sendMulti({
        messages: [{
            'content': getMessage(messages[0], {}, lang),
            'to_number': contact.phone_number
        }, {
            'content': getMessage(messages[1], {}, lang),
            'to_number': contact.phone_number
        }]
    });

    global.waitForResponse(batch1smsResponseHandler.handlerName);
};