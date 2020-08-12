var translations = require('./translations/message-translations');
var translator = require('../utils/translator/translator');
var adminLogger = require('../rw-legacy/lib/admin-alert');
var notifyELK = require('../notifications/elk-notification/elkNotification');
/**
 * Holds the core implementation of group repayments  
 * For devs: you can extend the behaviours of this function by adding more inputs
 * @param {Object} session_details Object with properties as session details that are specific to the country 
 * @param {String} session_details.lang language being use
 * @param {String} session_details.main_menu  main menu to be displayed depending on which country
 * @param {String} session_details.main_menu_handler input handler for main menu depending on the country
 */

function registerInputHandlers(session_details){
    state.vars.group_repayment_variables = JSON.stringify(session_details);
    var lastFourIdDigitsHandler = require('./inputHandlers/lastFourIdDigitsHandler');
    var individualBalanceMenuHandler = require('./inputHandlers/individualBalanceHandler');
    var backToGroupSummaryHandler = require('./inputHandlers/groupSummaryHandler');
    addInputHandler('enter_last_four_id_digits', lastFourIdDigitsHandler);
    addInputHandler('view_individual_balance_menu', individualBalanceMenuHandler);
    addInputHandler('back_to_group_summary', backToGroupSummaryHandler);
}

/**
 * starts the group repayment summary feature for group leaders
 * @param {Object} session_details Session Details that are specific to the country
 * @param {String} session_details.lang the language used during the session
 */
function startGroupRepayments(session_details) {
    notifyELK();
    var lang = session_details.lang;
    var getMessage = translator(translations, lang);
    var getClient = require('../shared/rosterApi/getClient');
    var country = project.vars.country;
    try{
        var client = getClient(state.vars.account_number, country);
    } catch(error) {
        console.log(error);
        adminLogger(error, 'Roster API call error: Get client by account number');
        return;
    }
    state.vars.district_id = client.DistrictId;
    state.vars.group_id = client.GroupId;
    state.vars.national_id = client.NationalId;
    sayText(getMessage('NATIONAL_ID_last_four_digits', {}, lang));
    promptDigits('enter_last_four_id_digits', {submitOnHash: false, maxDigits: 4, timeout: 5});
}

module.exports = {
    registerGroupRepaymentHandlers: registerInputHandlers,
    startGroupRepayments: startGroupRepayments
};
