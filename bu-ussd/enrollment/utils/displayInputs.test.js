const displayInputs = require('./displayInputs');

var selectedBundle = {
    bundleId: '123',
    bundleName: 'Biolite',
    bundleInputs: [
        {
            bundleInputId: 432,
            inputName: 'Biolite type1',
        },
        {
            bundleInputId: 732,
            inputName: 'Biolite Low light',
        },
        {
            bundleInputId: 854,
            inputName: 'Torch 2.0',
        }
    ]
};

var lang = 'en_bu';

describe('display bundles', () => {
    it('should display bundles and save necessary state variables', () => {
        displayInputs(lang, selectedBundle);
        expect(sayText).toHaveBeenCalledWith( 'Biolite\n' +
        '1) Biolite type1\n' +
        '2) Biolite Low light\n' + 
        '3) Torch 2.0\n');
        expect(state.vars.input_screens).toEqual('{"1":"Biolite\\n1) Biolite type1\\n2) Biolite Low light\\n3) Torch 2.0\\n"}');
        expect(state.vars.input_option_values).toEqual('{"1":"432","2":"732","3":"854"}');
        expect(state.vars.current_inputs_menu).toEqual('1');
    });
});
