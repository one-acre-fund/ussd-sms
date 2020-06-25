var getMessage = require('../translations/getMessage');

/**
     * This is the callback function called on input handlers
     * @param {String} input parameter of the callback
     */
module.exports = function individualBalanceHandler(input) {
    var group_repayment_variables = JSON.parse(state.vars.group_repayment_variables);

    var lang = group_repayment_variables.lang;
    var main_menu = group_repayment_variables.main_menu;
    var main_menu_handler = group_repayment_variables.main_menu_handler;

    var all_screens = JSON.parse(state.vars.all_screens);
    var current_screen = state.vars.current_screen;
    var next_screen = state.vars.next_screen;
    var previous_screen = state.vars.previous_screen;
    var members_last_screen = state.vars.members_last_screen;
    var menu = '';

    if(input == '*' && next_screen <= members_last_screen) {
        menu = all_screens[next_screen];
        state.vars.current_screen = next_screen;
        state.vars.next_screen = next_screen + 1;
        state.vars.previous_screen = previous_screen + 1;
        sayText(menu);
        promptDigits('view_individual_balance_menu', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        });
    } else if(input == '#') {
        if(previous_screen >= 0) {
            menu = all_screens[previous_screen];
            state.vars.current_screen = previous_screen;
            state.vars.next_screen = current_screen;
            state.vars.previous_screen = previous_screen - 1;
            sayText(menu);
            promptDigits('view_individual_balance_menu', {
                submitOnHash: false,
                maxDigits: 2,
                timeout: 5
            });
        } else {
            // take them to the main menu if they click back while being on group summary (first screen)
            sayText(main_menu);
            promptDigits(main_menu_handler, {submitOnHash: false, maxDigits: 2, timeout: 5});
        }
    } else {
        var group_members = JSON.parse(state.vars.group_members);
        var current_member = group_members[input -1];
        if(!current_member) {
            // wrong choice.
            sayText(getMessage('invalid_try_again', {'$Menu': all_screens[state.vars.current_screen]}, lang));
            promptDigits('view_individual_balance_menu', {
                submitOnHash: false,
                maxDigits: 2,
                timeout: 5
            });
        } else {
            menu = getMessage('group_member_repayment', {'$firstName': current_member.firstName,
                '$lastName': current_member.lastName,
                '$credit': current_member.credit,
                '$balance': current_member.balance, 
                '$repaid': current_member.repaid,
                '$repaid_percentage': current_member['% Repaid']}) + getMessage('back', {'$label': '#'}, lang);
            sayText(menu);
            promptDigits('back_to_group_summary',{submitOnHash: false, maxDigits: 1, timeout: 5 });
        }
    }
};
