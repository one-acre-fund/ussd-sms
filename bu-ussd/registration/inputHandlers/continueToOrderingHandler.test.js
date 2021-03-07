const continueToOrderingHandler = require('./continueToOrderingHandler');

describe('continue to ordering handler', () => {
    it('should stop the process when the user inputs zero', () => {
        const handler = continueToOrderingHandler.getHandler('en-bu');
        handler('0');
        expect(stopRules).toHaveBeenCalled();
    });

    it('should handler ordering once user chooses 1', () => {
        const handler = continueToOrderingHandler.getHandler('en-bu');
        handler('1');
        expect(sayText).toHaveBeenCalledWith('ordering is coming soon');
    });
});
