const marketAccessHandler = require('./marketAccessHandler');

describe('market access menu handler', () => {
    it('should call onMarketAccessOptionChosen', () => {
        const onMarketAccessOptionChosen = jest.fn();
        const handler = marketAccessHandler.getHandler(onMarketAccessOptionChosen);
        handler(1);
        expect(onMarketAccessOptionChosen).toHaveBeenCalledWith(1);
    });
});
