const eligibilityReasonHandler = require('./eligibilityReasonHandler');

describe('eligibility reason handler', () => {
    it('should show the more information if client is eligible', () => {
        state.vars.isEligibleForCredit = 'YES';
        state.vars.eligibility_details = JSON.stringify({reason: 'you have paid your debt'});
        const handler = eligibilityReasonHandler.getHandler('en');
        handler();
        expect(sayText).toHaveBeenCalledWith('You are eligible for that credit because you have paid your debt');
    });
    it('should show the more information if client is eligible eligible', () => {
        state.vars.isEligibleForCredit = 'NO';
        state.vars.eligibility_details = JSON.stringify({reason: 'you have not paid your debt'});
        const handler = eligibilityReasonHandler.getHandler('en');
        handler();
        expect(sayText).toHaveBeenCalledWith('You are eligible for that credit because you have not paid your debt');
    });
});
