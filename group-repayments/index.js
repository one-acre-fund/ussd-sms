var getMessage = require('./translations/getMessage');
var fetchGroupRepaymentInformation = require('./api/groupRepaymentsApi');
// var lastFourIdDigitsHandler = require('./inputHandlers/lastFourIdDigitsHandler');
// var individualBalanceHandler = require('./inputHandlers/individualBalanceHandler');
// var groupSummaryHandler = require('./inputHandlers/groupSummaryHandler');

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

function spinGroupRepayments(session_details) {
    var lang = session_details.lang;
    state.vars.district_id = session_details.DistrictId;
    state.vars.group_id = session_details.GroupId;
    sayText(getMessage('NATIONAL_ID_last_four_digits', {}, lang));
    promptDigits('enter_last_four_id_digits', {submitOnHash: false, maxDigits: 4, timeout: 5});
}

module.exports = {
    registerGroupRepaymentHandlers: registerInputHandlers,
    spinGroupRepayments: spinGroupRepayments
};