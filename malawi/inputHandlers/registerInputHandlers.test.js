const accountNumberInputHandler = require('./accountNumberInputHandler');
const mainMenuHandler = require('./mainMenuHandler');
const nextScreenBalanceHandler = require('../checkBalance/inputHandlers/nextScreenBalance');
const buybackTransactions =  require('../../buyback-transactions/buyBackTransactions');

const registerInputHandler = require('./registerInputHandlers');

jest.mock('./accountNumberInputHandler');
jest.mock('./mainMenuHandler');
jest.mock('../checkBalance/inputHandlers/nextScreenBalance');
jest.mock('../../buyback-transactions/buyBackTransactions');

describe.only('registering input handlers', () => {
    it('should register account number input handler', () => {
        const handler = jest.fn();
        jest.spyOn(accountNumberInputHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandler('en-mw');
        expect(addInputHandler).toHaveBeenCalledWith(accountNumberInputHandler.handlerName, handler);
    });
    it('should register mainMenuHandler input handler', () => {
        const handler = jest.fn();
        jest.spyOn(mainMenuHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandler('en-mw');
        expect(addInputHandler).toHaveBeenCalledWith(mainMenuHandler.handlerName, handler);
    });
    it('should register nextScreenBalanceHandler input handler', () => {
        const handler = jest.fn();
        jest.spyOn(nextScreenBalanceHandler, 'getHandler').mockReturnValueOnce(handler);
        registerInputHandler('en-mw');
        expect(addInputHandler).toHaveBeenCalledWith(nextScreenBalanceHandler.handlerName, handler);
    });

    it('should register buybackTransactions input handler', () => {
        registerInputHandler('en-mw');
        expect(buybackTransactions.registerInputHandlers).toHaveBeenCalledWith();
    });
});
