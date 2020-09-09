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
var addResponseHandlers = require('./responseHandlers/addResponseHandlers');
var Batch1ResponseHandler = require('./responseHandlers/batch1ResponseHandler');

var lang = contact.vars.lang;
var getMessage = translator(translations, lang);
project.sendMulti({
    messages: [
        {content: getMessage('sms-1.1', {}, lang), to_number: contact.phone_number}, 
        {content: getMessage('sms-1.2', {}, lang), to_number: contact.phone_number}], 
    message_type: 'text'
});
waitForResponse(Batch1ResponseHandler.handlerName);

addResponseHandlers(lang);