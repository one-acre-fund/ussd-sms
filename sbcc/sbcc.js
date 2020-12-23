var translations = require('./translations/message-translations');
var translator = require('../utils/translator/translator');
var notifyELK = require('../notifications/elk-notification/elkNotification');

function registerInputHandlers(session_details) {
    state.vars.sbcc_variables = JSON.stringify(session_details);
    var nationalIdHandler = require('./input-handlers/nationalIdHandler');
    var pinHandler = require('./input-handlers/pinHandler');
    var getSbccMenuHandler = require('./input-handlers/sbccMenuHandler');
    var pinMenuHandler = require('./input-handlers/pinHandler');

    addInputHandler('sbcc_menu', getSbccMenuHandler(session_details.backMenu));
    addInputHandler('national_id', nationalIdHandler);
    addInputHandler('pin_menu', pinMenuHandler);
    addInputHandler('pin', pinHandler);
}

function startSBCC(session_details) {
    notifyELK();
    var lang = session_details.lang;
    state.vars.lang = lang;
    var getMessage = translator(translations, lang);

    sayText(getMessage('sbcc_menu', {}, lang));
    promptDigits('sbcc_menu', {submitOnHash: true, maxDigits: 2, timeout: 5});
}

module.exports = {
    registerInputHandlers: registerInputHandlers,
    startSBCC: startSBCC
};