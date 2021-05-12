var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

var handlerName = 'rw_pshop_credit_eligibility';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function() {
            var getMessage = translator(translations, lang);
            var isEligibleForCredit = state.vars.isEligibleForCredit;
            var eligibilityDetails = JSON.parse(state.vars.eligibility_details);
            var eligibilityMessage = '';
            var reason = eligibilityDetails.reason;
            if(isEligibleForCredit) {
                // is eligible for credit
                eligibilityMessage = getMessage('more_eligible', {'$reason': reason}, lang);
            } else {
                // not eligible for credit
                eligibilityMessage = getMessage('more_not_eligible', {'$reason': reason}, lang);
            }
            global.sayText(eligibilityMessage);
            global.stopRules();
        };
    }
};
