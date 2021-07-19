var agentCodeHandler = require('./agentCodeHandler');

describe('agent code handler', () => {
    beforeAll(() => {
        service.vars.mkt_access_agentCode = '123456';
    });
    it('should call onMarketAccessOptionChosen with param 3 if the client enters a valid agent code', () => {
        var onMarketAccessOptionChosen = jest.fn();
        var handler = agentCodeHandler.getHandler(onMarketAccessOptionChosen);
        handler('123456');
        expect(onMarketAccessOptionChosen).toHaveBeenCalledWith(3);
    });

    it('should call reprompt for agent code if the input does not match the stored agent code', () => {
        project.vars.mkt_access_agentCod = '123456';
        var onMarketAccessOptionChosen = jest.fn();
        var handler = agentCodeHandler.getHandler(onMarketAccessOptionChosen);
        handler('65745456');
        expect(sayText).toHaveBeenCalledWith('Enter Agent Code');
        expect(promptDigits).toHaveBeenCalledWith(agentCodeHandler.handlerName);
    });
});