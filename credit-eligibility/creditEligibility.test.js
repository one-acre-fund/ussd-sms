const creditEligibility = require('./creditEligibility');
const eligibilityReasonHandler = require('./inputHandlers/eligibilityReasonHandler');
const registerInputHandlers = require('./inputHandlers/registerInputHandler');
const getEligibilityDetails = require('./utils/getEligibilityDetails');

jest.mock('./utils/getEligibilityDetails');
const client = {AccountNumber: '34523232'};

describe('credit eligibility', () => {
    it('should show a not eligible message if the user is not eligible', () => {
        getEligibilityDetails.mockReturnValueOnce({eligibility_decision: false, outstanding_amount: 1235});
        creditEligibility.start('en', client);
        expect(sayText).toHaveBeenCalledWith('You are not eligible for a credit.\n' +
        'Outstanding amount: 1235\n' +
        'For more details, insert 1.');
        expect(promptDigits).toHaveBeenCalledWith(eligibilityReasonHandler.handlerName);
        expect(state.vars.isEligibleForCredit).toBe(false);
    });

    it('should show an eligible message if the user is eligible', () => {
        getEligibilityDetails.mockReturnValueOnce({eligibility_decision: true, outstanding_amount: 1235, min_credit: 150, max_credit: 500, pre_payment: 200, solar: 'YES'});
        creditEligibility.start('en', client);
        expect(sayText).toHaveBeenCalledWith('You are eligible for a credit:\n' +
        'Min credit: 150\n' +
        'Max credit: 500\n' +
        'Prepayment: 200\n' +
        'Solar: YES\n' +
        'For more details, insert 1');
        expect(promptDigits).toHaveBeenCalledWith(eligibilityReasonHandler.handlerName);
        expect(state.vars.isEligibleForCredit).toBe(true);
        expect(state.vars.eligibility_details).toEqual('{"eligibility_decision":true,"outstanding_amount":1235,"min_credit":150,"max_credit":500,"pre_payment":200,"solar":"YES"}');
    });
});
