var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var batch1smsResponseHandler = require('./responseHandlers/batch1smsResponseHandler');

module.exports = function(lang) {
    var getMessage = translator(translations, lang);

    var messages = ['sms_1.1', 'sms_1.2'];
    var start_time_offset = 0;
    messages.forEach(function(message) {
        project.scheduleMessage({
            content: getMessage(message, {}, lang),
            to_number: contact.phone_number,
            start_time_offset: start_time_offset
        });
        start_time_offset +=15;
    });

    global.waitForResponse(batch1smsResponseHandler.handlerName);
};