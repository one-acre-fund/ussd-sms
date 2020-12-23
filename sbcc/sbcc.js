var translations = require('./translations/message-translations');
var translator = require('../utils/translator/translator');
var notifyELK = require('../notifications/elk-notification/elkNotification');

function registerInputHandlers(session_details) {
    state.vars.sbcc_variables = JSON.stringify(session_details);
    console.log('sbcc variables inside registerhandlers ' + JSON.stringify(state.vars.sbcc_variables));
    var nationalIdHandler = require('./input-handlers/nationalIdHandler');
    var pinHandler = require('./input-handlers/pinHandler');
    var sbccMenuHandler = require('./input-handlers/sbccMenuHandler');

    addInputHandler('sbcc_menu', sbccMenuHandler);
    addInputHandler('national_id', nationalIdHandler);
    addInputHandler('pin', pinHandler);
}

function startSBCC(session_details) {
    notifyELK();
    var lang = session_details.lang;
    state.vars.lang = lang;
    state.vars.backMenu = session_details.backMenu;
    console.log('sbcc variables inside startSBBC before adding menu ' + JSON.stringify(state.vars.sbcc_variables));
    state.vars.sbcc_variables.backMenu = session_details.backMenu;
    console.log('sbcc variables inside startSBBC after adding menu ' + JSON.stringify(state.vars.sbcc_variables));
    var getMessage = translator(translations, lang);

    sayText(getMessage('sbcc_menu', {}, lang));
    promptDigits('sbcc_menu', {submitOnHash: true, maxDigits: 2, timeout: 5});
}

module.exports = {
    registerInputHandlers: registerInputHandlers,
    startSBCC: startSBCC
};