var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var mainMenuInputHandler = require('./inputHandlers/mainMenuInputHandler');
var registration = require('./registration/registration');

function registerInputHandlers(lang, credit_officers_table) {
    addInputHandler(mainMenuInputHandler.handlerName, mainMenuInputHandler.getHandler(lang));
    registration.registerInputHandlers(lang, credit_officers_table);
}

function start(lang) {
    var getMessage = translator(translations, lang);
    var message = getMessage('service_title', {}, lang) + getMessage('register_client', {'$label': 1}, lang);
    sayText(message);
    promptDigits(mainMenuInputHandler.handlerName);
}

module.exports = {
    start: start,
    registerInputHandlers: registerInputHandlers
};
