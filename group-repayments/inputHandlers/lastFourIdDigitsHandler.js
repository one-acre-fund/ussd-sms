var getMessage = require('../translations/getMessage');
var fetchGroupRepaymentInformation = require('../api/groupRepaymentsApi');
/**
     * Callback to the Input handler for handling the user input for last four digits of id
     * @param {String} input parameter to the callback
     */
module.exports = function lastFourIdDigitsHandler(input) {
    var group_repayment_variables = JSON.parse(state.vars.group_repayment_variables);

    var lang = group_repayment_variables.lang;
    var lastFourIdDigits = String(input.replace(/D/g, ''));
    if(!state.vars.nid || parseInt(state.vars.nid.slice(-4)) != lastFourIdDigits) {
        sayText('wrong id please try again'); // replace with a message from translations
        promptDigits('enter_last_four_id_digits', {
            submitOnHash: false,
            maxDigits: 4,
            timeout: 5
        });
        return null;
    }
    // make api call to roster that returns an object similar to the following
    // this is a mock that will be replaced by the real values from the roster api call.
    var rosterCallResult = fetchGroupRepaymentInformation(state.vars.district_id, state.vars.group_id);
                
    // create an array of group members
    var groupRepayments = {credit: 0, balance: 0};
    var groupMembers = rosterCallResult.map(function(result) {
        var newResult = result;
        newResult.balance = result.credit - result.repaid;
        newResult['% Repaid'] = (result.repaid * 100) / result.credit;
        groupRepayments.credit = groupRepayments.credit + newResult.credit; 
        groupRepayments.balance = groupRepayments.balance + newResult.balance;
        return newResult;
    });

    var group_repayments = groupRepayments;
    var group_members = groupMembers;
    state.vars.group_members = JSON.stringify(group_members);
    var all_screens = [];
         
    var initialScreen = getMessage('group_credit', {'$groupCredit': group_repayments.credit}, lang) + getMessage('group_balance', {'$groupBalance': group_repayments.balance}, lang);
    var options = getMessage('continue', {'$label': '*'}, lang) + getMessage('back', {'$label': '#'}, lang);
    var index = 0;
    var preFix = index + 1;
    var record = getMessage('group_members_repayments', {'$prefix': preFix,
        '$firstName': group_members[index].firstName,
        '$lastName': group_members[index].lastName,
        '$balance': group_members[index].balance}, lang);

    while((initialScreen + record + options).length < 140 && index < group_members.length) {
        initialScreen = initialScreen + record;
        index = index + 1;
        preFix = index + 1;
        if(index < group_members.length) { 
            record = getMessage('group_members_repayments', {'$prefix': preFix, 
                '$firstName': group_members[index].firstName, 
                '$lastName': group_members[index].lastName, 
                '$balance': group_members[index].balance}, lang);
        }
        // record = preFix + ') ' + group_members[index].firstName + ' ' + group_members[index].lastName + ': '  + group_members[index].balance + ' RwF\n';
    }
    if(preFix < group_members.length) {
        initialScreen = initialScreen + options;
    } else {
        initialScreen = initialScreen + getMessage('back', {'$label': '#'}, lang);
    }
         
    all_screens.push(initialScreen);
    var screen = '';
    for(var i=index; i<group_members.length; ) {
        // find a way to manage the options to fit screens relevantly
        if(preFix == group_members.length) {
            options = getMessage('back', {'$label': '#'}, lang);
        }
        record = getMessage('group_members_repayments', {'$prefix': preFix, 
            '$firstName': group_members[i].firstName, 
            '$lastName': group_members[i].lastName, 
            '$balance': group_members[i].balance}, lang);
        if((screen + record + options).length <= 140) {
            screen = screen + record;
            i = i + 1;
            preFix = i + 1;
        }
        if((screen + record + options).length > 140 || i == group_members.length ){
            screen = screen + options;
            all_screens.push(screen);
            screen = '';
        }
    }
    state.vars.all_screens = JSON.stringify(all_screens);
    state.vars.current_screen = 0;
    state.vars.next_screen = 1;
    state.vars.previous_screen = -1;
    state.vars.members_last_screen = all_screens.length - 1;
    sayText(all_screens[0]);
    promptDigits('view_individual_balance_menu', {
        submitOnHash: false,
        maxDigits: 2,
        timeout: 5
    });
};  
