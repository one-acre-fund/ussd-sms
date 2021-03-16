var bundlesHandler = require('./inputHandlers/bundlesHandler');
var getBundles = require('./utils/getBundles');
var displayBundles = require('./utils/displayBundles');
var enrollment = require('./enrollment');

jest.mock('./utils/getBundles');
jest.mock('./utils/displayBundles');
var bundles = [
    {
        bundleName: 'Maize',
        bundleId: '124'
    },
    {
        bundleName: 'Biolite',
        bundleId: '647'
    }
];
var client = {AccountNumber: 10367619, FirstName: 'Tyrion', LastName: 'Lanyster'};
describe('enrollment', () => {
    it('should display bundles and prompt for selecting a bundle', () => {
        getBundles.mockReturnValueOnce(bundles);
        enrollment.start('en-bu', client);
        expect(displayBundles).toHaveBeenCalledWith(bundles, 'en-bu', client);
        expect(state.vars.enrolling_client).toEqual('{"AccountNumber":10367619,"FirstName":"Tyrion","LastName":"Lanyster"}');
        expect(state.vars.selected_bundles).toEqual('[]');
        expect(state.vars.bundles).toEqual('[{"bundleName":"Maize","bundleId":"124"},{"bundleName":"Biolite","bundleId":"647"}]');
        expect(promptDigits).toHaveBeenCalledWith(bundlesHandler.handlerName);
    });
    it('should export the start function and registerInputHandlers function', () => {
        expect(enrollment.start).toBeInstanceOf(Function);
        expect(enrollment.registerInputHandlers).toBeInstanceOf(Function);
    });
});
