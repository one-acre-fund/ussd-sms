var confirmOrder = require('../utils/confirmOrder');
var handlerName = 'bu_enr_on_change_order_handler';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang, onRemoveProductSelected) {
        return function(input) {
            var ordered_bundles_screens = JSON.parse(state.vars.ordered_bundles_screens);
            var ordered_bundles_option_values = JSON.parse(state.vars.ordered_bundles_option_values);
            var current_ordered_bundles_screen = parseInt(state.vars.current_ordered_bundles_screen);
            if(!input) {
                // reprompt
                global.sayText(ordered_bundles_screens[current_ordered_bundles_screen]);
                global.promptDigits(handlerName);
                return;
            }
            var selected_bundles = JSON.parse(state.vars.selected_bundles);
            input = input.trim();
            var selectedProductId = ordered_bundles_option_values[input];
            if(selectedProductId && selected_bundles.length > 1) {
                // remove the product and reprompt
                onRemoveProductSelected(lang, selectedProductId);
                global.promptDigits(handlerName);
            } else if(input == 0) {
                // confirm
                confirmOrder(lang);
            } else if(input == 77) {
                // next screen. reprompt
                state.vars.current_ordered_bundles_screen = current_ordered_bundles_screen + 1;
                global.sayText(ordered_bundles_screens[state.vars.current_ordered_bundles_screen]);
                global.promptDigits(handlerName);
            } else {
                // invalid choice reprompt
                global.sayText(ordered_bundles_screens[current_ordered_bundles_screen]);
                global.promptDigits(handlerName);
                return;
            }
        };
    }
};
