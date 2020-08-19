const inputHandlers =  require('./inputHandlers');

describe('Input handlers', () => {
    it('should export all input handlers', () => {
        expect(inputHandlers.accountNumberInputHandler).toBe(require('./accountNumberInputHandler'));
    });
});