var onChangeOrderHandler = require('../inputHandlers/onChangeOrderHandler');
const onChangeOrder = require('./onChangeOrder');

describe('on change order', () => {
    beforeAll(() => {
        state.vars.selected_bundles = JSON.stringify([
            {
                bundleName: 'Biolite',
                bundleId: 123
            },
            {
                bundleName: 'Maize',
                bundleId: 163
            }
        ]);
    });
    it('should save the necessary state variables and prompt for changing order', () => {
        onChangeOrder('en-bu');
        expect(state.vars.ordered_bundles_screens).toEqual('{"1":"Remove Product from List\\n0) Confirm\\n1) Biolite\\n2) Maize\\n"}');
        expect(state.vars.ordered_bundles_option_values).toEqual('{"1":"123","2":"163"}');
        expect(state.vars.current_ordered_bundles_screen).toEqual('1');
        expect(sayText).toHaveBeenCalledWith('Remove Product from List\n' +
        '0) Confirm\n' +
        '1) Biolite\n' +
        '2) Maize\n');
        expect(promptDigits).toHaveBeenCalledWith(onChangeOrderHandler.handlerName);
    });
});