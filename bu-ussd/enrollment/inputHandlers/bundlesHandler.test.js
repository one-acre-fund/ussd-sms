const bundlesHandler = require('./bundlesHandler');


describe('bundles input handler', () => {
    beforeAll(() => {
        state.vars.bundles_screens = JSON.stringify({'1': 'screen1', '2': 'screen2', '3': 'screen3'});
        state.vars.bundles_option_values = JSON.stringify({
            1: 1023, 2: 3045, 3: 567 
        });
        state.vars.bundles = JSON.stringify([
            {bundleId: 1023, bundleInputs: [{bundleInputId: 123}]},
            {bundleId: 3045, bundleInputs: [{bundleInputId: 567}]}]);
        state.vars.current_bundles_menu = 1;
    });
    it('should reprompt for bundle if user provides empty input', () => {
        const onBundleSelected = jest.fn();
        const handler = bundlesHandler.getHandler('en_bu', onBundleSelected);
        handler();
        expect(sayText).toHaveBeenCalledWith('screen1');
        expect(promptDigits).toHaveBeenCalledWith(bundlesHandler.handlerName);
    });  
    it('should reprompt for bundle if user provides invalid input', () => {
        const onBundleSelected = jest.fn();
        const handler = bundlesHandler.getHandler('en_bu', onBundleSelected);
        handler('1bc03!00');
        expect(sayText).toHaveBeenCalledWith('screen1');
        expect(promptDigits).toHaveBeenCalledWith(bundlesHandler.handlerName);
    });
    it('should show the next screen once the user enters 77', () => {
        const onBundleSelected = jest.fn();
        const handler = bundlesHandler.getHandler('en_bu', onBundleSelected);
        handler('77');
        expect(sayText).toHaveBeenCalledWith('screen2');
        expect(state.vars.current_bundles_menu).toEqual(2);
        expect(promptDigits).toHaveBeenCalledWith(bundlesHandler.handlerName);
    });  
    it('should call onBundleSelected once user chooses an existing bundle', () => {
        const onBundleSelected = jest.fn();
        const handler = bundlesHandler.getHandler('en_bu', onBundleSelected);
        handler('1');
        expect(onBundleSelected).toHaveBeenCalledWith('en_bu', {'bundleId': 1023, 'bundleInputs': [{'bundleInputId': 123}]});
    });  
});
