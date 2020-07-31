var translations = require('./translations/index');
var translator = require('../../utils/translator/translator');

function registerInputHandlers(){
    var villageIdHandler = require('./inputHandlers/villageIdHandler');
    var registeredConfirmedHandler = require('./inputHandlers/registeredConfirmedHandler');
    var nextScreenHandler = require('./inputHandlers/nextScreensHandler');

    addInputHandler('village_id', villageIdHandler);
    addInputHandler('registered_confirmed', registeredConfirmedHandler);
    addInputHandler('next_farmers_list', nextScreenHandler);
}

/**
 * Spins the status
 * @param {Object} session_details Session Details that are specific to the country
 * @param {String} session_details.lang the language used during the session
 */
function startTesterPackStatus() {
    var lang = state.vars.lang || 'en';
    var getMessage = translator(translations, lang);
    sayText(getMessage('village_id', {}, lang));
    promptDigits('village_id', {
        timeout: 5,
        maxDigits: 2,
        submitOnHash: false
    });
}

module.exports = {
    registerTesterPackStatusHandlers: registerInputHandlers,
    startTesterPackStatus: startTesterPackStatus
};
