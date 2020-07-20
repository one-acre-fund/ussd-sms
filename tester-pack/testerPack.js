var translations = require('./translations/index');
var translator = require('../utils/translator/translator');

/**
 * REgisters all input handlers for duka location 
 * For devs: you can extend the behaviours of this function by adding more inputs
 * @param {Object} session_details Object with properties as session details 
 * @param {String} session_details.lang language being use
 */

function registerInputHandlers(session_details){
    // state.vars.group_repayment_variables = JSON.stringify(session_details);
    state.vars.lang = session_details.lang;
    var testerPackMenuHandler = require('./inputHandlers/testerPackMenuHandler');
    var provinceHandler = require('./inputHandlers/provinceHandler');
    var districtHandler = require('./inputHandlers/districtsHandler');
    var sectorHandler = require('./inputHandlers/sectorsHandler');
    var cellHandler = require('./inputHandlers/cellHandler');
    var villageHandler = require('./inputHandlers/villageHandler');
    var farmerHandler = require('./inputHandlers/farmerHandler');
    var lastFourIdDigitsHandler = require('./inputHandlers/lastfourNidDigitsHandler');
    var receptionHandler = require('./inputHandlers/receptionHandler');

    addInputHandler('tester_pack_menu', testerPackMenuHandler);
    addInputHandler('select_province', provinceHandler);
    addInputHandler('select_district', districtHandler);
    addInputHandler('select_sector', sectorHandler);
    addInputHandler('select_cell', cellHandler);
    addInputHandler('select_village', villageHandler);
    addInputHandler('select_farmer', farmerHandler);
    addInputHandler('last_four_nid_digits', lastFourIdDigitsHandler);
    addInputHandler('confirm_reception', receptionHandler);
    

}

/**
 * Spins the duka locator 
 * @param {Object} session_details Session Details that are specific to the country
 * @param {String} session_details.lang the language used during the session
 */
function spinTesterPackConfirmation(session_details) {
    var lang = session_details.lang;
    var getMessage = translator(translations, lang);

    sayText(getMessage('tester_pack_menu'));
    promptDigits('tester_pack_menu', {submitOnHash: false, maxDigits: 2, timeout: 5});
}

module.exports = {
    registerTesterPackConfirmationHandlers: registerInputHandlers,
    spinTesterPackConfirmation: spinTesterPackConfirmation
};
