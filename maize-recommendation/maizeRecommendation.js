 
var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
    
var lang = contact.vars.lang;
var getMessage = translator(translations, lang);
var welcome_message = getMessage('welcome_message', {}, lang);
var promptDistrict = getMessage('district', {}, lang);

project.sendMulti({
    messages: [
        {content: welcome_message, to_number: contact.phone_number}, 
        {content: promptDistrict, to_number: contact.phone_number}], 
    message_type: 'text'
});

waitForResponse('district');
