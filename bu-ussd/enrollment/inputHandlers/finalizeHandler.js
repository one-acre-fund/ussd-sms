var onKeepOrdering = require('../utils/onKeepOrdering');
var onChangeOrder = require('../utils/onChangeOrder');
var confirmOrder = require('../utils/confirmOrder');

var handlerName = 'bu_enr_finalize_handler';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            if(!input) {
                global.sayText(state.vars.finalize_screen);
                global.promptDigits(handlerName);
            }
            var all_bundles = JSON.parse(state.vars.bundles);
            var selected_bundles = JSON.parse(state.vars.selected_bundles);
            if(input == 1 && all_bundles.length > selected_bundles.length) {
                // add another product
                onKeepOrdering(lang);
            } else if(input == 2) {
                // change order
                onChangeOrder(lang);
            } else if(input == 3) {
                // confirm
                // place order and send a message
                confirmOrder(lang);
            } else {
                global.sayText(state.vars.finalize_screen);
                global.promptDigits(handlerName);
            }
        };
    }
};
