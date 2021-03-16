const onKeepOrdering = require('./onKeepOrdering');

// utils
var getBundles = require('./getBundles');
var displayBundles = require('./displayBundles');
// input handler
var bundlesHandler = require('../inputHandlers/bundlesHandler');

// mocks
jest.mock('./getBundles');
jest.mock('./displayBundles');
jest.mock('./../inputHandlers/bundlesHandler');

const clientMock = {DistrictId: 123};
describe('on keep ordering', () => {
    beforeAll(() => {
        state.vars.enrolling_client = JSON.stringify(clientMock);
    });
    it('should call get bundles, display bundles and prompt for choosing bundle', () => {
        getBundles.mockReturnValueOnce([{bundleName: 'biolite'}]);
        onKeepOrdering('en_bu');
        expect(displayBundles).toHaveBeenCalledWith([{bundleName: 'biolite'}], 'en_bu', clientMock);
        expect(promptDigits).toHaveBeenCalledWith(bundlesHandler.handlerName);
    });
});
