const orderMoreHandler = require('./orderMoreHandler');

describe('order more handler', () => {
    it('should end the session if the user enter anything but 1', () => {
        const onOrderMore = jest.fn();
        const handler = orderMoreHandler.getHandler(onOrderMore);
        handler(2);
        expect(onOrderMore).not.toHaveBeenCalled();
        expect(global.stopRules).toHaveBeenCalled();
    });
    it('should call the order more callback once the user enter 1 so that they can order more products', () => {
        const onOrderMore = jest.fn();
        const handler = orderMoreHandler.getHandler(onOrderMore);
        handler(1);
        expect(onOrderMore).toHaveBeenCalled();
    });
});
