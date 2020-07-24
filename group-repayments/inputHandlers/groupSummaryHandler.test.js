const groupSummaryHandler = require('./groupSummaryHandler');

describe('Back to group summary handler', () => {
    beforeAll(() => {
        global.state = { vars: {} };
    });
    beforeEach(() => {
        jest.resetModules();
    });
    it('should take the user back to the group summary', () => {
        global.state.vars.group_repayment_variables = JSON.stringify({lang: 'en'});
        global.state.vars.all_screens = JSON.stringify(['group summary']);
        global.state.vars.current_screen = 0;
        groupSummaryHandler('#');
        expect(sayText).toHaveBeenCalledWith('group summary');
        expect(promptDigits).toHaveBeenCalledWith('view_individual_balance_menu', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        });
    });

    it('should handle the incorrect choice', () => {
        global.state.vars.group_repayment_variables = JSON.stringify({lang: 'en'});
        global.state.vars.all_screens = JSON.stringify(['group summary']);
        global.state.vars.current_screen = 0;
        groupSummaryHandler('*');
        expect(sayText).toHaveBeenCalledWith('Invalid input, please try again.\ngroup summary');
        expect(promptDigits).toHaveBeenCalledWith('view_individual_balance_menu', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        }); 
    });
});
