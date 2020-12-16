const individualBalanceHandler = require('./individualBalanceHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

jest.mock('../../notifications/elk-notification/elkNotification');

describe('Back to group summary handler', () => {
    beforeAll(() => {
        global.state = { vars: {} };
        global.service = {vars: {currency: 'RwF'}};
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should take the user to the next screen on 77', () => {
        global.state.vars.group_repayment_variables = JSON.stringify({lang: 'en', main_menu: 'main menu', main_menu_handler: 'BackToMain'});
        global.state.vars.all_screens = JSON.stringify(['screen1', 'screen2']);
        global.state.vars.current_screen = 0;
        global.state.vars.previous_screen = -1;
        global.state.vars.next_screen = 1;
        global.state.vars.members_last_screen = 1;
        individualBalanceHandler('77');
        expect(sayText).toHaveBeenCalledWith('screen2');
        expect(state.vars.next_screen).toBe(2);
        expect(state.vars.previous_screen).toBe(0);
        expect(state.vars.current_screen).toBe(1);
        expect(promptDigits).toHaveBeenCalledWith('view_individual_balance_menu', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        });
    });

    it('should take the user to the previous screen on 44', () => {
        global.state.vars.group_repayment_variables = JSON.stringify({lang: 'en', main_menu: 'main menu', main_menu_handler: 'BackToMain'});
        global.state.vars.all_screens = JSON.stringify(['screen1', 'screen2']);
        global.state.vars.current_screen = 1;
        global.state.vars.previous_screen = 0;
        global.state.vars.next_screen = 2;
        global.state.vars.members_last_screen = 1;
        individualBalanceHandler('44');
        expect(sayText).toHaveBeenCalledWith('screen1');
        expect(state.vars.next_screen).toBe(1);
        expect(state.vars.previous_screen).toBe(-1);
        expect(state.vars.current_screen).toBe(0);
        expect(promptDigits).toHaveBeenCalledWith('view_individual_balance_menu', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        });
    });

    it('should take the user to the previous screen on 44', () => {
        global.state.vars.group_repayment_variables = JSON.stringify({lang: 'en', main_menu: 'main menu', main_menu_handler: 'BackToMain'});
        global.state.vars.all_screens = JSON.stringify(['screen1', 'screen2']);
        global.state.vars.current_screen = 0;
        global.state.vars.previous_screen = -1;
        global.state.vars.next_screen = 1;
        global.state.vars.members_last_screen = 1;
        individualBalanceHandler('44');
        expect(sayText).toHaveBeenCalledWith('main menu');
        expect(promptDigits).toHaveBeenCalledWith('BackToMain', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        });
    });

    it('should display a single user details', () => {
        global.state.vars.group_repayment_variables = JSON.stringify({lang: 'en', main_menu: 'main menu', main_menu_handler: 'BackToMain'});
        global.state.vars.all_screens = JSON.stringify(['screen1', 'screen2']);
        global.state.vars.current_screen = 0;
        global.state.vars.previous_screen = -1;
        global.state.vars.next_screen = 1;
        global.state.vars.members_last_screen = 1;
        global.state.vars.group_members = JSON.stringify([{firstName: 'bahati', lastName: 'robben', credit: 120, balance: 60, repaid: 60, overpayment: 0, '% Repaid': 50}]);
        individualBalanceHandler(1);
        expect(sayText).toHaveBeenCalledWith(
            'Name: bahati robben\n' + 
            'Credit: 120 RwF\n' +
            'Balance: 60 RwF\n' +
            'Amount repaid: 60 RwF\n' +
            'overpaid: 0\n'+
            '% repaid: 50.00%\n' + 
            '44) Go back');
        expect(promptDigits).toHaveBeenCalledWith('back_to_group_summary', {
            submitOnHash: false,
            maxDigits: 1,
            timeout: 5
        });
    });

    it('should handle an invalid selection on selection of non existing members and give a chance for retry', () => {
        global.state.vars.group_repayment_variables = JSON.stringify({lang: 'en', main_menu: 'main menu', main_menu_handler: 'BackToMain'});
        global.state.vars.all_screens = JSON.stringify(['screen1', 'screen2']);
        global.state.vars.current_screen = 0;
        global.state.vars.previous_screen = -1;
        global.state.vars.next_screen = 1;
        global.state.vars.members_last_screen = 1;
        global.state.vars.group_members = JSON.stringify([{firstName: 'bahati', lastName: 'robben', credit: 120, balance: 60, repaid: 60, '% Repaid': '50%'}]);
        individualBalanceHandler(22);
        expect(sayText).toHaveBeenCalledWith('Invalid input, please try again.\nscreen1');
        expect(promptDigits).toHaveBeenCalledWith('view_individual_balance_menu', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        });
    });

    it('should call notifyELK',()=>{
        individualBalanceHandler(22);
        expect(notifyELK).toHaveBeenCalled();
    });
    
});
