const shsWarranty = require('./shs-warranty');

describe('shsWarrantty', () => {
    it('should have a registerhandlers function', () => {
        expect(shsWarranty.registerHandlers).toBeInstanceOf(Function);
    });
    it('should have a start function', () => {
        expect(shsWarranty.start).toBeInstanceOf(Function);
    });
});