const onRemoveProductSelected = require('./onRemoveProductSelected');
const onChangeOrder = require('./onChangeOrder');

jest.mock('./onChangeOrder');
describe('on remove product selected', () => {
    beforeAll(() => {
        state.vars.selected_bundles = JSON.stringify([
            {bundleId: 1234}, {bundleId: 4342}, {bundleId: 643}
        ]);
    });
    it('should  call on change order and remove the selected bundle from selected bundles', () => {
        onRemoveProductSelected('en-bu', 4342);
        expect(state.vars.selected_bundles).toEqual('[{"bundleId":1234},{"bundleId":643}]');
        expect(onChangeOrder).toHaveBeenCalledWith('en-bu');
    });
});