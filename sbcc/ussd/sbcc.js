var translations = require('../translations/message-translations');
var translator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

/**
 * Registers all input handlers for SBCC
 * @param {Object} session_details Object with properties for the current session
 * @param {String} session_details.lang language being used
 * @param {function} session_details.backMenu function that takes user back to the non client menu
 */
function registerInputHandlers(session_details) {
    var nationalIdHandler = require('./input-handlers/nationalIdHandler');
    var pinHandler = require('./input-handlers/pinHandler');
    var sbccMenuHandler = require('./input-handlers/sbccMenuHandler');
    var pinMenuHandler = require('./input-handlers/pinMenuHandler');

    addInputHandler(
        'sbcc_menu',
        sbccMenuHandler.getHandler(session_details.backMenu)
    );
    addInputHandler('national_id', nationalIdHandler);
    addInputHandler('pin_menu', pinMenuHandler);
    addInputHandler('pin', pinHandler);
}

/**
 * starts the SBCC process
 * @param {Object} session_details Session Details that are specific to the country
 * @param {String} session_details.lang the language used during the session
 */
function startSBCC(session_details) {
    notifyELK();
    var lang = session_details.lang;
    state.vars.lang = lang;
    var getMessage = translator(translations, lang);

    sayText(getMessage('sbcc_menu', {}, lang));
    promptDigits('sbcc_menu', { submitOnHash: true, maxDigits: 2, timeout: 5 });
}

module.exports = {
    registerInputHandlers: registerInputHandlers,
    startSBCC: startSBCC,
};
