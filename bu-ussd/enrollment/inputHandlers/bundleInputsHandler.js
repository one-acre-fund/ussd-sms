var handlerName = 'bu_enr_inputs_handler';

module.exports = {
    handlerName: handlerName,
    getHandler: function(language, onBundleSelected) {
        return function(input) {
            var inputScreens = JSON.parse(state.vars.input_screens);
            var inputs_option_values = JSON.parse(state.vars.input_option_values);
            var currentInputsMenu = parseInt(state.vars.current_inputs_menu);
            if(!input) {
                global.sayText(inputScreens[currentInputsMenu]);
                global.promptDigits(handlerName);
                return;
            }

            
            input = input.trim();
            if(input == '77') {
                state.vars.current_inputs_menu = currentInputsMenu +1;
                global.sayText(inputScreens[state.vars.current_inputs_menu]);
                global.promptDigits(handlerName);
                return;
            }
            var selectedInputId = inputs_option_values[input];
            if(selectedInputId) {
                var selectedBundles = JSON.parse(state.vars.selected_bundles);
                var selectedBundle = selectedBundles.shift();
                state.vars.selected_bundles = JSON.stringify(selectedBundles);
                var selectedInputs = selectedBundle.bundleInputs.filter(function(bundleInput) {
                    return bundleInput.bundleInputId == selectedInputId;
                });
                selectedBundle.bundleInputs = [selectedInputs[0]];
                onBundleSelected(language, selectedBundle);
            } else {
                global.sayText(inputScreens[currentInputsMenu]);
                global.promptDigits(handlerName);
            }
        };
    }
};
