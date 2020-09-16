const SerialNumberHandler = require('./serial-number');

describe('SerialNumberHandler', () => {
    it('should have a non empty name label', () => {
        expect(typeof SerialNumberHandler.name).toBe('string');
        expect(SerialNumberHandler.name.trim()).toBeTruthy();
    });
    it('should have a getHandlerFunction', () => {
        expect(SerialNumberHandler.getHandler).toBeInstanceOf(Function);
    });
});