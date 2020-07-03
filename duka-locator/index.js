var translations = require('./translations/index');
var translator = require('./../utils/translator/translator');
var adminLogger = require('../rw-legacy/lib/admin-alert');

/**
 * Holds the core implementation of group repayments  
 * For devs: you can extend the behaviours of this function by adding more inputs
 * @param {Object} session_details Object with properties as session details that are specific to the country 
 * @param {String} session_details.lang language being use
 * @param {String} session_details.main_menu  main menu to be displayed depending on which country
 * @param {String} session_details.main_menu_handler input handler for main menu depending on the country
 */

function registerInputHandlers(session_details){
    // state.vars.group_repayment_variables = JSON.stringify(session_details);
    var regionHandlers = require('./inputHandlers/regionHandler');
    var countyHandler = require('./inputHandlers/countyHandler');
    var dukaHandler = require('./inputHandlers/dukaHandler');
    var contactDukaHandlerAgent = require('./inputHandlers/contactDukaAgentHandler');
    addInputHandler('select_oaf_duka_region', regionHandlers);
    addInputHandler('select_oaf_duka_county', countyHandler);
    addInputHandler('select_oaf_duka', dukaHandler);
    addInputHandler('reach_out_to_agent', contactDukaHandlerAgent);
}

/**
 * Spins the group repayment summary feature for group leaders
 * @param {Object} session_details Session Details that are specific to the country
 * @param {String} session_details.lang the language used during the session
 */
function spinDukaLocator(session_details) {
    var lang = session_details.lang;
    var getMessage = translator(translations, lang);
    var dukaRegionsTable = project.getOrCreateDataTable('Duka_locator_regions');
    var regionsEntries = dukaRegionsTable.queryRows();
    var regions = '';
    var all_regions = [];
    while(regionsEntries.hasNext()) {
        var record = regionsEntries.next().vars;
        all_regions.push(record.region_name);
        regions = regions + String(record.region_id) + ') ' + record.region_name + '\n';
    }
    state.vars.all_regions = JSON.stringify(all_regions);
    state.vars.not_listed_option = dukaRegionsTable.num_rows + 1;
    var not_listed_choice = getMessage('unlisted_region', {'$label': dukaRegionsTable.num_rows + 1}, lang);
    state.vars.duka_current_menu = getMessage('select_oaf_duka_region', {'$Menu': regions}, lang) + not_listed_choice;
    sayText(state.vars.duka_current_menu);
    promptDigits('select_oaf_duka_region', {submitOnHash: false, maxDigits: 2, timeout: 5});
}

module.exports = {
    registerDukaLocatorHandlers: registerInputHandlers,
    spinDukaLocator: spinDukaLocator
};