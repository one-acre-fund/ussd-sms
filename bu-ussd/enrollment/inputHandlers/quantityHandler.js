var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');

var handlerName = 'bu_enr_quantity_handler';

module.exports = {
    handlerName: handlerName,
    getHandler: function(language, onQuantitySelected) {
        return function(input) {
            var getMessage = translator(translations, language);
            var selectedBundle = JSON.parse(state.vars.selected_bundles)[0];
            var unit = selectedBundle.bundleInputs[0].unit;
            var min = selectedBundle.bundleInputs[0].min ||  unit == 'unit' ? 1 : 0.1;
            var max = selectedBundle.bundleInputs[0].max;
            if(!input) {
                global.sayText(getMessage('enter_quantity', {
                    '$unit': selectedBundle.bundleInputs[0].unit,
                    '$bundleInput': selectedBundle.bundleInputs[0].inputName
                }, language));
                global.promptDigits(handlerName);
                return;
            }
            
            var quantity = input.trim();
            if(quantity < min || quantity > max) {
                global.sayText(getMessage('enter_quantity', {
                    '$unit': selectedBundle.bundleInputs[0].unit,
                    '$bundleInput': selectedBundle.bundleInputs[0].inputName
                }, language));
                global.promptDigits(handlerName);
                return;
            } else {
                onQuantitySelected(language, quantity);
            }
        };
    }
};