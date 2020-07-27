var translations = require('./translations/index');
var translator = require('../../utils/translator/translator');

function registerInputHandlers(){
    var provinceHandler = require('./inputHandlers/provinceHandler');
    var districtHandler = require('./inputHandlers/districtsHandler');
    var sectorHandler = require('./inputHandlers/sectorsHandler');
    var cellHandler = require('./inputHandlers/cellHandler');
    var villageHandler = require('./inputHandlers/villageHandler');
    var farmerHandler = require('./inputHandlers/farmerHandler');
    var lastFourIdDigitsHandler = require('./inputHandlers/lastfourNidDigitsHandler');
    var receptionHandler = require('./inputHandlers/receptionHandler');

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
function startTesterPackConfirmation() {
    var lang = state.vars.lang || 'en';
    var getMessage = translator(translations, lang);
    var provinces = {'1': 'EASTERN ZONE', '2': 'KIGALI CITY', '3': 'SOUTHERN ZONE', '4': 'WESRERN ZONE', '5': 'NORTHERN ZONE'};
    state.vars.provinces = JSON.stringify(provinces);
    sayText(getMessage('provinces_title', {}, lang) + getMessage('provinces', {}, lang));
    promptDigits('select_province', {
        timeout: 5,
        maxDigits: 2,
        submitOnHash: false
    });
}

module.exports = {
    registerTesterPackConfirmationHandlers: registerInputHandlers,
    startTesterPackConfirmation: startTesterPackConfirmation
};
