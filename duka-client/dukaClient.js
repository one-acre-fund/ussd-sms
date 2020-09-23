var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var mainMenuInputHandler = require('./inputHandlers/mainMenuInputHandler');
var registration = require('./registration/registration');

function registerInputHandlers(lang, duka_clients_table) {
    addInputHandler(mainMenuInputHandler.handlerName, mainMenuInputHandler.getHandler(lang));
    registration.registerInputHandlers(lang, duka_clients_table);
}

function start(lang, credit_officer_details) {
    var getMessage = translator(translations, lang);
    var message = getMessage('service_title', {}, lang) + getMessage('register_client', {'$label': 1}, lang);
    state.vars.credit_officer_details = JSON.stringify(credit_officer_details);
    sayText(message);
    promptDigits(mainMenuInputHandler.handlerName);
}

module.exports = {
    start: start,
    registerInputHandlers: registerInputHandlers
};
