const bundleInputsHandler = require('./bundleInputsHandler');


describe('bundleinputs input handler', () => {
    beforeAll(() => {
        state.vars.input_screens = JSON.stringify({'1': 'screen1', '2': 'screen2', '3': 'screen3'});
        state.vars.input_option_values = JSON.stringify({
            1: 123, 2: 345, 3: 567 
        });
        state.vars.selected_bundles = JSON.stringify([
            {bundleId: 1, bundleInputs: [{bundleInputId: 123}]},
            {bundleId: 2, bundleInputs: [{bundleInputId: 567}]}]);
        state.vars.current_inputs_menu = 1;
    });
    it('should reprompt for bundle if user provides empty input', () => {
        const onBundleSelected = jest.fn();
        const handler = bundleInputsHandler.getHandler('en-bu', onBundleSelected);
        handler();
        expect(sayText).toHaveBeenCalledWith('screen1');
        expect(promptDigits).toHaveBeenCalledWith(bundleInputsHandler.handlerName);
    });  
    it('should reprompt for bundle if user provides invalid input', () => {
        const onBundleSelected = jest.fn();
        const handler = bundleInputsHandler.getHandler('en-bu', onBundleSelected);
        handler('1bc03!00');
        expect(sayText).toHaveBeenCalledWith('screen1');
        expect(promptDigits).toHaveBeenCalledWith(bundleInputsHandler.handlerName);
    });
    it('should show the next screen once the user enters 77', () => {
        const onBundleSelected = jest.fn();
        const handler = bundleInputsHandler.getHandler('en-bu', onBundleSelected);
        handler('77');
        expect(sayText).toHaveBeenCalledWith('screen2');
        expect(state.vars.current_inputs_menu).toEqual(2);
        expect(promptDigits).toHaveBeenCalledWith(bundleInputsHandler.handlerName);
    });  
    it('should show the next screen once the user enters 77', () => {
        const onBundleSelected = jest.fn();
        const handler = bundleInputsHandler.getHandler('en-bu', onBundleSelected);
        handler('1');
        expect(state.vars.selected_bundles).toEqual('[{"bundleId":2,"bundleInputs":[{"bundleInputId":567}]}]');
        expect(onBundleSelected).toHaveBeenCalledWith('en-bu', {'bundleId': 1, 'bundleInputs': [{'bundleInputId': 123}]});
    });  
});
