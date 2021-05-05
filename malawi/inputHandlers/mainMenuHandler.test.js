const buybackTransactions = require('../../buyback-transactions/buyBackTransactions');
const checkBalance = require('../checkBalance/checkBalance');
const mainMenuHandler = require('./mainMenuHandler');

jest.mock('../../buyback-transactions/buyBackTransactions');
jest.mock('../checkBalance/checkBalance');

describe('main menu handler', () => {
    beforeAll(() => {
        state.vars.mw_main_screens = JSON.stringify({'1': 'screen1', '2': 'screen2'});
        state.vars.mw_main_option_values = JSON.stringify({'1': 'buy_back', '2': 'check_balance'});
        state.vars.current_mw_main_screen = '1';
        state.vars.client_json = JSON.stringify({AccountNumber: 1245342, ClientName: 'Tyrion Lanyster'});
    });

    it('should reprompt if input is invalid', () => {
        const handler = mainMenuHandler.getHandler('en-mw');
        handler('000');
        expect(sayText).toHaveBeenCalledWith('screen1');
        expect(promptDigits).toHaveBeenCalledWith(mainMenuHandler.handlerName);
    });
    it('should show the next screen if the user chooses 77', () => {
        const handler = mainMenuHandler.getHandler('en-mw');
        handler('77');
        expect(sayText).toHaveBeenCalledWith('screen2');
        expect(promptDigits).toHaveBeenCalledWith(mainMenuHandler.handlerName);
        expect(state.vars.current_mw_main_screen).toEqual(2);
    });
    it('should start buyback once user selects it', () => {
        const handler = mainMenuHandler.getHandler('en-mw');
        handler('1');
        expect(buybackTransactions.start).toHaveBeenCalledWith({'AccountNumber': 1245342, 'ClientName': 'Tyrion Lanyster'});
    });
    it('should start check balance once user selects it', () => {
        const handler = mainMenuHandler.getHandler('en-mw');
        handler('2');
        expect(checkBalance.start).toHaveBeenCalledWith('en-mw', {'AccountNumber': 1245342, 'ClientName': 'Tyrion Lanyster'});
    });
});
