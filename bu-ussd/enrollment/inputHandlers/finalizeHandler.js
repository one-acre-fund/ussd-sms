var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
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

            if(input == 1) {
                // add another product
                onKeepOrdering(lang);
            } else if(input == 2) {
                // change order
                onChangeOrder(lang);
            } else if(input == 3) {
                // confirm
                // place order and send a message
                confirmOrder();
            }
        };
    }
};
