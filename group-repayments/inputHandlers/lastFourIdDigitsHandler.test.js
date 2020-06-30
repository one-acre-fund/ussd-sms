const lastFourIdDigitsHandler = require('./lastFourIdDigitsHandler');

describe('Last four nid digits input handler', () => {
    beforeAll(() => {
        global.state = { vars: {national_id: '119987129264223'} };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should handle the correct input id', () => {
        const content = JSON.stringify([{
            firstName: 'bahati', 
            lastName: 'robben', 
            credit: 12000, 
            balance: 5000}]);
        jest.spyOn(httpClient, 'request').mockReturnValue({status: 200, content });
        global.state.vars.group_repayment_variables = JSON.stringify({lang: 'en'});
        lastFourIdDigitsHandler('4223');
        expect(sayText).toHaveBeenCalledTimes(1);
        expect(promptDigits).toHaveBeenCalledWith('view_individual_balance_menu', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        });
    });

    it('should handle incorect input', () => {
        global.state.vars.group_repayment_variables = JSON.stringify({lang: 'en'});
        lastFourIdDigitsHandler('5334');
        expect(sayText).toHaveBeenCalledTimes(1);
        expect(promptDigits).toHaveBeenCalledWith('enter_last_four_id_digits', {
            submitOnHash: false,
            maxDigits: 4,
            timeout: 5
        });
    });
});
