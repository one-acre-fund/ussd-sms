var translations = require('../translations/message-translations');
var translator = require('../../utils/translator/translator');

var fetchGroupRepaymentInformation = require('../api/groupRepaymentsApi');
var adminLogger = require('../../rw-legacy/lib/admin-alert');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
/**
 * Callback to the Input handler for handling the user input for last four digits of id
 * @param {String} input parameter to the callback
 */
module.exports = function lastFourIdDigitsHandler(input) {
    notifyELK();
    var group_repayment_variables = JSON.parse(state.vars.group_repayment_variables);
    
    var lang = group_repayment_variables.lang;
    var getMessage = translator(translations, lang);

    var lastFourIdDigits = String(input.replace(/D/g, ''));

    if(!state.vars.national_id || parseInt(state.vars.national_id.slice(-4),10) != lastFourIdDigits) {
        sayText(getMessage('invalid_try_again', {'$Menu': getMessage('NATIONAL_ID_last_four_digits', {}, lang)}, lang));
        promptDigits('enter_last_four_id_digits', {
            submitOnHash: false,
            maxDigits: 4,
            timeout: 5
        });
        return null;
    }
    try{
        var rosterCallResult = fetchGroupRepaymentInformation(state.vars.district_id, state.vars.group_id);
    } catch(error) {
        adminLogger(error, 'Roster API Call: Fetching group information');
        return;
    }     
    // create an array of group members
    var groupRepayments = { credit: 0, balance: 0, overpayment: 0 };
    var groupMemberBalances = {};
    rosterCallResult.forEach(function (result) {
        var balance = (result.credit - result.repaid);
        groupRepayments.credit += result.credit;
        groupRepayments.balance += balance;
        var memberName = result.firstName + ' ' + result.lastName;
        if (!groupMemberBalances[memberName]) {
            groupMemberBalances[memberName] = result;
            groupMemberBalances[memberName].balance = balance;
        } else {
            groupMemberBalances[memberName].repaid += result.repaid;
            groupMemberBalances[memberName].credit += result.credit;
            groupMemberBalances[memberName].balance += balance;
        }
        groupMemberBalances[memberName].overpayment = 0;
        var diff = groupMemberBalances[memberName].credit - groupMemberBalances[memberName].repaid;
        if(diff < 0){
            groupMemberBalances[memberName].overpayment = -diff;
            groupMemberBalances[memberName].balance = 0;
        }
        groupMemberBalances[memberName]['% Repaid'] = groupMemberBalances[memberName].credit === 0 ?
            100 :
            (groupMemberBalances[memberName].repaid * 100) / groupMemberBalances[memberName].credit;
    });


    var group_repayments = groupRepayments;
    var group_members = Object.keys(groupMemberBalances).map(function (key) {
        return groupMemberBalances[key];
    });

    state.vars.group_members = JSON.stringify(group_members);
    var all_screens = [];
    var initialScreen = getMessage('group_credit', {'$groupCredit': group_repayments.credit, '$currency': service.vars.currency}, lang) + getMessage('group_balance', {'$groupBalance': group_repayments.balance, '$currency': service.vars.currency}, lang);
    var options = getMessage('continue', {'$label': '77'}, lang) + getMessage('back', {'$label': '44'}, lang);
    var index = 0;
    var preFix = index + 1;
    var record = getMessage('group_members_repayments', {'$prefix': preFix,
        '$firstName': group_members[index].firstName,
        '$lastName': group_members[index].lastName,
        '$balance': group_members[index].balance,
        '$currency': service.vars.currency}, lang);

    while((initialScreen + record + options).length < 140 && index < group_members.length) {
        initialScreen = initialScreen + record;
        index = index + 1;
        preFix = index + 1;
        if(index < group_members.length) { 
            record = getMessage('group_members_repayments', {'$prefix': preFix, 
                '$firstName': group_members[index].firstName, 
                '$lastName': group_members[index].lastName, 
                '$balance': group_members[index].balance,
                '$currency': service.vars.currency}, lang);
        }
    }
    if(preFix < group_members.length) {
        initialScreen = initialScreen + options;
    } else {
        initialScreen = initialScreen + getMessage('back', {'$label': '44'}, lang);
    }
         
    all_screens.push(initialScreen);
    var screen = '';
    for(var i=index; i<group_members.length; ) {
        if(preFix == group_members.length) {
            options = getMessage('back', {'$label': '44'}, lang);
        }
        record = getMessage('group_members_repayments', {'$prefix': preFix, 
            '$firstName': group_members[i].firstName, 
            '$lastName': group_members[i].lastName, 
            '$balance': group_members[i].balance,
            '$currency': service.vars.currency}, lang);
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
