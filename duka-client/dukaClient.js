var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var mainMenuInputHandler = require('./inputHandlers/mainMenuInputHandler');

function registerInputHandlers(lang) {
    addInputHandler(mainMenuInputHandler.handlerName, mainMenuInputHandler.getHandler(lang));
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
