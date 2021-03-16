const onQuantitySelected = require('./onQuantitySelected');
const orderOrFinalizeHandler = require('../inputHandlers/orderOrFinalizeHandler');

describe('on quantity selected', () => {
    beforeAll(() => {
        state.vars.selected_bundles = JSON.stringify([
            {bundleId: 123, bundleInputs: [{bundleInputId: 123}]},
            {bundleId: 453, bundleInputs: [{bundleInputId: 321}]}
        ]);
    });
    it('should append quantity on the first bundle input in the bundle object and prompt for filanize', () => {
        onQuantitySelected('en-bu', 23);
        expect(state.vars.selected_bundles).toEqual('[{"bundleId":123,"bundleInputs":[{"bundleInputId":123,"quantity":23}]},{"bundleId":453,"bundleInputs":[{"bundleInputId":321}]}]');
        expect(sayText).toHaveBeenCalledWith( '1) Continue ordering\n2) Confirm and finalize');
        expect(promptDigits).toHaveBeenCalledWith(orderOrFinalizeHandler.handlerName);
    });
});