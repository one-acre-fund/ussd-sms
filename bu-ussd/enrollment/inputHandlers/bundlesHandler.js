var handlerName = 'bu_enr_bundles_handler';

module.exports = {
    handlerName: handlerName,
    getHandler: function(language, onBundleSelected) {
        return function(input) {
            var bundlesScreens = JSON.parse(state.vars.bundles_screens);
            var bundles_option_values = JSON.parse(state.vars.bundles_screens);
            var currentBundlesMenu = parseInt(state.vars.current_bundles_menu);
            if(!input) {
                global.sayText(bundlesScreens[currentBundlesMenu]);
                global.promptDigits(handlerName);
                return;
            }
            
            input = input.trim();
            if(input == '77') {
                state.vars.current_bundles_menu = currentBundlesMenu + 1;
                global.sayText(bundlesScreens[state.vars.current_inputs_menu]);
                global.promptDigits(handlerName);
                return;
            }
            var selectedBundleId = bundles_option_values[input];
            if(selectedBundleId) {
                var bundles = JSON.parse(state.vars.bundles);
                var selectedBundle = bundles.filter(function(bundle) {return bundle.bundleId == selectedBundleId;});
                onBundleSelected(language, selectedBundle[0]);
            } else {
                global.sayText(bundlesScreens[currentBundlesMenu]);
                global.promptDigits(handlerName);
            }
        };
    }
};
