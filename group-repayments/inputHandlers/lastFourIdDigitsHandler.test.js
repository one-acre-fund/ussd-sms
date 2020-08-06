const lastFourIdDigitsHandler = require('./lastFourIdDigitsHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');
describe('Last four nid digits input handler', () => {
    beforeAll(() => {
        global.state = { vars: {national_id: '119987129264223'} };
        global.service = {vars: {currency: 'RwF'}};
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should handle the correct input id', () => {
        const content = JSON.stringify([{
            firstName: 'bahati', 
            lastName: 'robben', 
            credit: 12000, 
            repaid: 5000}]);
        jest.spyOn(httpClient, 'request').mockReturnValue({status: 200, content });
        global.state.vars.group_repayment_variables = JSON.stringify({lang: 'en'});
        lastFourIdDigitsHandler('4223');
        expect(sayText).toHaveBeenCalledWith('Group credit: 12000 RwF\n' +
        'Group balance: 7000 RwF\n' +
        '1) bahati robben: 7000 RwF\n' + 
        '# Go back');
        expect(promptDigits).toHaveBeenCalledWith('view_individual_balance_menu', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        });
    });

    it('should handle incorect input', () => {
        global.state.vars.group_repayment_variables = JSON.stringify({lang: 'en'});
        lastFourIdDigitsHandler('5334');
        expect(sayText).toHaveBeenCalledWith('Invalid input, please try again.\nPlease enter the last four digits of the national ID you registered with');
        expect(promptDigits).toHaveBeenCalledWith('enter_last_four_id_digits', {
            submitOnHash: false,
            maxDigits: 4,
            timeout: 5
        });
    });
    it('should call notifyELK',()=>{
        lastFourIdDigitsHandler('5334');
        expect(notifyELK).toHaveBeenCalled();
    });
    
});
