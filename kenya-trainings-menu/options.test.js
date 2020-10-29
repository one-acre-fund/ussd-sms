const getOptions = require('./options');

describe('training options', () => {
    it('should return the options', () => {
        const options = getOptions();
        expect(options).toBeTruthy();
    });
});
