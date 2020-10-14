
module.exports = function() {
    var defaultEnvironment;
    if(service.active){
        defaultEnvironment = 'prod';
    }else{
        defaultEnvironment = 'dev';
    }

    var env;
    if(service.vars.env === 'prod' || service.vars.env === 'dev'){
        env = service.vars.env;
    }else{
        env = defaultEnvironment;
    }

    console.log(env);

    var translations = require('./translations/index');
    var translator = require('../utils/translator/translator');
    var Batch1ResponseHandler = require('./responseHandlers/batch1ResponseHandler');

    var lang = contact.vars.lang;
    var getMessage = translator(translations, lang);
    var messages = ['sms-1.1', 'sms-1.2'];
    var start_time_offset = 0;
    messages.forEach(function(message) {
        project.scheduleMessage({
            content: getMessage(message, {}, lang),
            to_number: contact.phone_number,
            start_time_offset: start_time_offset
        });
        start_time_offset +=15;
    });
    global.waitForResponse(Batch1ResponseHandler.handlerName);
    return lang;
};
