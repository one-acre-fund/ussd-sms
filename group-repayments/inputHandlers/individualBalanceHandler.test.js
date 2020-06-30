const individualBalanceHandler = require('./individualBalanceHandler');

describe('Back to group summary handler', () => {
    beforeAll(() => {
        global.state = { vars: {} };
    });
    beforeEach(() => {
        jest.resetModules();
    });

    it('should take the user to the next screen on *', () => {
        global.state.vars.group_repayment_variables = JSON.stringify({lang: 'en', main_menu: 'main menu', main_menu_handler: 'BackToMain'});
        global.state.vars.all_screens = JSON.stringify(['screen1', 'screen2']);
        global.state.vars.current_screen = 0;
        global.state.vars.previous_screen = -1;
        global.state.vars.next_screen = 1;
        global.state.vars.members_last_screen = 1;
        individualBalanceHandler('*');
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

    it('should take the user to the previous screen on #', () => {
        global.state.vars.group_repayment_variables = JSON.stringify({lang: 'en', main_menu: 'main menu', main_menu_handler: 'BackToMain'});
        global.state.vars.all_screens = JSON.stringify(['screen1', 'screen2']);
        global.state.vars.current_screen = 1;
        global.state.vars.previous_screen = 0;
        global.state.vars.next_screen = 2;
        global.state.vars.members_last_screen = 1;
        individualBalanceHandler('#');
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

    it('should take the user to the previous screen on #', () => {
        global.state.vars.group_repayment_variables = JSON.stringify({lang: 'en', main_menu: 'main menu', main_menu_handler: 'BackToMain'});
        global.state.vars.all_screens = JSON.stringify(['screen1', 'screen2']);
        global.state.vars.current_screen = 0;
        global.state.vars.previous_screen = -1;
        global.state.vars.next_screen = 1;
        global.state.vars.members_last_screen = 1;
        individualBalanceHandler('#');
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
        global.state.vars.group_members = JSON.stringify([{firstName: 'bahati', lastName: 'robben', credit: 120, balance: 60, repaid: 60, '% Repaid': '50%'}]);
        individualBalanceHandler(1);
        expect(sayText).toHaveBeenCalledTimes(1);
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
        expect(sayText).toHaveBeenCalledTimes(1);
        expect(promptDigits).toHaveBeenCalledWith('view_individual_balance_menu', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        });
    });
    
});
