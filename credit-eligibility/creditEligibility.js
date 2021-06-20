var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var eligibilityReasonHandler = require('./inputHandlers/eligibilityReasonHandler');
var registerInputHandlers = require('./inputHandlers/registerInputHandler');
var getEligibilityDetails = require('./utils/getEligibilityDetails');

function start(lang, client) {
    var getMessage = translator(translations, lang);
    var eligibilityMessage = '';
    var eligibilityDetails = getEligibilityDetails(client);
    var isEligibleForCredit = eligibilityDetails && eligibilityDetails.eligibility_decision;

    state.vars.isEligibleForCredit = isEligibleForCredit;
    state.vars.eligibility_details = JSON.stringify(eligibilityDetails);
    if(isEligibleForCredit) {
        // eligible
        eligibilityMessage = getMessage('eligible', {
            '$min_credit': eligibilityDetails.min_credit,
            '$max_credit': eligibilityDetails.max_credit,
            '$prepayment': eligibilityDetails.pre_payment,
            '$solar': eligibilityDetails.solar
        }, lang);
        global.sayText(eligibilityMessage);
        global.promptDigits(eligibilityReasonHandler.handlerName);
    } else {
        // not eligible
        var outstanding_amount = eligibilityDetails.outstanding_amount;
        eligibilityMessage = getMessage('not_eligible', {'$outstanding_amount': outstanding_amount}, lang);
        global.sayText(eligibilityMessage);
        global.promptDigits(eligibilityReasonHandler.handlerName);
    }
}

module.exports = {
    start: start,
    registerInputHandlers: registerInputHandlers
};
