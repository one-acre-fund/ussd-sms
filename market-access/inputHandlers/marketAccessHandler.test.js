const marketAccessHandler = require('./marketAccessHandler');
const agentCodeHandler = require('./agentCodeHandler');

describe('market access menu handler', () => {
    it('should call onMarketAccessOptionChosen if client chooses 1 or 2', () => {
        const onMarketAccessOptionChosen = jest.fn();
        const handler = marketAccessHandler.getHandler(onMarketAccessOptionChosen);
        handler(1);
        expect(onMarketAccessOptionChosen).toHaveBeenCalledWith(1);
    });

    it('reprompt for account number if a client chooses 0', () => {
        const onMarketAccessOptionChosen = jest.fn();
        const handler = marketAccessHandler.getHandler(onMarketAccessOptionChosen);
        handler(0);
        expect(sayText).toHaveBeenCalledWith('Welcome to TUBURA. Please enter your account number or \n1) To regiter\n2) Non Client Menu');
        expect(promptDigits).toHaveBeenCalledWith('account_number_splash');
    });

    it('should prompt for agent code if client enters 3', () => {
        const onMarketAccessOptionChosen = jest.fn();
        const handler = marketAccessHandler.getHandler(onMarketAccessOptionChosen);
        handler(3);
        expect(sayText).toHaveBeenCalledWith('Enter Agent Code');
        expect(promptDigits).toHaveBeenCalledWith(agentCodeHandler.handlerName);
    });
});
