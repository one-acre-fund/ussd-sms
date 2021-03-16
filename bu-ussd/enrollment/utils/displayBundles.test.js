const displayBundles = require('./displayBundles');

var bundles = [
    {
        bundleId: '123',
        bundleName: 'Biolite'
    },
    {
        bundleId: '234',
        bundleName: 'Maize'
    },
    {
        bundleId: '456',
        bundleName: 'Potatoes'
    }
];
var client = {FirstName: 'Jamie', LastName: 'Lanyster'};
var lang = 'en_bu';

describe('display bundles', () => {
    beforeAll(() => {
        state.vars.selected_bundles = JSON.stringify([
            {
                bundleId: '234',
                bundleName: 'Maize'
            }
        ]);
    });
    it('should display bundles and save necessary state variables', () => {
        displayBundles(bundles, lang, client);
        expect(sayText).toHaveBeenCalledWith('Select a Product for Jamie Lanyster\n' +
        '1) Biolite\n' +
        '2) Potatoes\n');
        expect(state.vars.bundles_screens).toEqual('{"1":"Select a Product for Jamie Lanyster\\n1) Biolite\\n2) Potatoes\\n"}');
        expect(state.vars.bundles_option_values).toEqual('{"1":"123","2":"456"}');
        expect(state.vars.current_bundles_menu).toEqual('1');
    });
});
