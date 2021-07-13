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
    const tableMock = {queryRows: jest.fn()};
    jest.spyOn(project, 'initDataTableById').mockReturnValue(tableMock);
    const cursorMock = {hasNext: jest.fn(), next: jest.fn()};
    jest.spyOn(tableMock, 'queryRows').mockReturnValue(cursorMock);
    it('should display bundles and prompt for selecting a bundle', () => {
        cursorMock.hasNext.mockReturnValueOnce(false);
        getBundles.mockReturnValueOnce(bundles);
        enrollment.start('en_bu', client);
        expect(displayBundles).toHaveBeenCalledWith(bundles, 'en_bu', client);
        expect(state.vars.enrolling_client).toEqual('{"AccountNumber":10367619,"FirstName":"Tyrion","LastName":"Lanyster"}');
        expect(state.vars.selected_bundles).toEqual('[]');
        expect(state.vars.bundles).toEqual('[{"bundleName":"Maize","bundleId":"124"},{"bundleName":"Biolite","bundleId":"647"}]');
        expect(promptDigits).toHaveBeenCalledWith(bundlesHandler.handlerName);
    });
    it('should initial the session with previously ordered bundles if its a returning client', () => {
        cursorMock.hasNext.mockReturnValueOnce(true);
        cursorMock.next.mockReturnValueOnce({vars: {
            order: JSON.stringify([{bundleId: 123, bundleName: 'Maize'}])
        }});
        getBundles.mockReturnValueOnce(bundles);
        enrollment.start('en_bu', client);
        expect(state.vars.selected_bundles).toEqual('[{"bundleId":123,"bundleName":"Maize"}]');
        expect(tableMock.queryRows).toHaveBeenCalledWith({'vars': {'account_number': 10367619}});
    });
    it('should export the start function and registerInputHandlers function', () => {
        expect(enrollment.start).toBeInstanceOf(Function);
        expect(enrollment.registerInputHandlers).toBeInstanceOf(Function);
    });
});
