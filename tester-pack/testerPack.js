var translations = require('./translations/index');
var translator = require('../utils/translator/translator');

/**
 * REgisters all input handlers for tester pack
 * For devs: you can extend the behaviours of this function by adding more inputs
 * @param {Object} session_details Object with properties as session details 
 * @param {String} session_details.lang language being use
 */

function registerInputHandlers(session_details){
    // state.vars.group_repayment_variables = JSON.stringify(session_details);
    state.vars.lang = session_details.lang;
    var testerPackMenuHandler = require('./inputHandlers/testerPackMenuHandler');
    var confirmation = require('./confirmation/confirmTesterPackReception');
    var status = require('./status/status')
    
    addInputHandler('tester_pack_menu', testerPackMenuHandler);
    confirmation.registerTesterPackConfirmationHandlers();
    status.registerTesterPackStatusHandlers();
}

/**
 * TesterPack
 * @param {Object} session_details Session Details that are specific to the country
 * @param {String} session_details.lang the language used during the session
 */
function startTesterPack(session_details) {
    var lang = session_details.lang;
    state.vars.lang = lang;
    var getMessage = translator(translations, lang);

    sayText(getMessage('tester_pack_menu'));
    promptDigits('tester_pack_menu', {submitOnHash: false, maxDigits: 2, timeout: 5});
}

module.exports = {
    registerTesterPackHandlers: registerInputHandlers,
    startTesterPack: startTesterPack
};
