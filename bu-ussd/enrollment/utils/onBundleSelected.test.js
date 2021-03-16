const bundleInputsHandler = require('../inputHandlers/bundleInputsHandler');
const quantityHandler = require('../inputHandlers/quantityHandler');
const onBundleSelected = require('./onBundleSelected');

describe('on bundle selected', () => {
    beforeAll(() => {
        state.vars.selected_bundles = JSON.stringify([
            {
                bundleId: '123',
                bundleName: 'Biolite',
                bundleInputs: [
                    {inputName: 'Bio-12', bundleInputId: 324}
                ]
            },
            {
                bundleId: '435',
                bundleName: 'Maize',
                bundleInputs: [
                    {inputName: 'Maize-inter', bundleInputId: 546}
                ]
            }
        ]);
    });

    it('should display inputs if the selected bundle has more than one input and add it to the list of selected bundles', () => {
        const selectedBundle = {
            bundleId: '734',
            bundleName: 'Irish',
            bundleInputs: [
                {inputName: 'Irish-1', bundleInputId: 2532},
                {inputName: 'Irish-2', bundleInputId: 2873}
            ]
        };
        onBundleSelected('en-bu', selectedBundle);
        expect(sayText).toHaveBeenCalledWith('Irish\n' +
        '1) Irish-1\n' +
        '2) Irish-2\n');
        expect(state.vars.selected_bundles).toEqual('[{"bundleId":"734","bundleName":"Irish","bundleInputs":' + 
        '[{"inputName":"Irish-1","bundleInputId":2532},{"inputName":"Irish-2","bundleInputId":2873}]},{"bundleId":"123","bundleName":"Biolite","bundleInputs":' + 
        '[{"inputName":"Bio-12","bundleInputId":324}]},{"bundleId":"435","bundleName":"Maize","bundleInputs":[{"inputName":"Maize-inter","bundleInputId":546}]}]');
        expect(promptDigits).toHaveBeenCalledWith(bundleInputsHandler.handlerName);
    });
    it('should prompt for quantity if the bundle has only one bundle input', () => {
        const selectedBundle = {
            bundleId: '734',
            bundleName: 'Irish',
            bundleInputs: [
                {inputName: 'Irish-1', bundleInputId: 2532, unit: 'kg'},
            ]
        };
        onBundleSelected('en-bu', selectedBundle);
        expect(sayText).toHaveBeenCalledWith('Select Quantity: Irish-1 /kg');
        expect(promptDigits).toHaveBeenCalledWith(quantityHandler.handlerName);
    });
});