const createOptionNamesForBundles = require('./createOptionNamesForBundles');
describe('create option names for bundles util', () => {
    it('should return option names when passed bundles array', () => {
        var bundles = [
            {
                bundleId: 123,
                bundleName: 'Biolite'
            },
            {
                bundleId: 345,
                bundleName: 'Maize'
            }
        ];
        const optionNames = createOptionNamesForBundles(bundles);
        expect(optionNames).toEqual({'123': 'Biolite', '345': 'Maize'});
    });
    it('should return an empty object when passed nothing', () => {
        const optionNames = createOptionNamesForBundles();
        expect(optionNames).toEqual({});
    });
});