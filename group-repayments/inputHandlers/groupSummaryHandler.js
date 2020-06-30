var getMessage = require('../translations/getMessage');
/**
     * Input handler for handling the choice of returning the user to group summary 
     * @param {String} lang language being used (en, rw, sw)
     */
module.exports = function groupSummaryHandler(input) {
    var group_repayment_variables = JSON.parse(state.vars.group_repayment_variables);

    var lang = group_repayment_variables.lang;
    var all_screens = JSON.parse(state.vars.all_screens);
    if(input == '#') {
        sayText(all_screens[state.vars.current_screen]);
        promptDigits('view_individual_balance_menu', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        });
    } else {
        sayText(getMessage('invalid_try_again', {'$Menu': all_screens[state.vars.current_screen]}, lang));
        promptDigits('view_individual_balance_menu', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        });
    }
};