var handlerName = 'variety_choice_handler';
//var translations = require('../translations');
//var createTranslator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
//var translate =  createTranslator(translations, project.vars.lang);
var chosenInput = [];
function isValidBundleInput(input, bundleInputs){
    chosenInput = bundleInputs[input-1];
    console.log('bundle chosen:'+JSON.stringify(chosenInput) + ' length '+ chosenInput.length);
    if(chosenInput.length != 0){
        return true;
    }
    return false;

}
module.exports = {
    handlerName: handlerName,
    getHandler: function(onVarietyChosen){
        return function (input) {
            var allVarieties = JSON.parse(state.vars.allVarieties);
            console.log('inside variety choice handler'+JSON.stringify(allVarieties));
            notifyELK();
            if (state.vars.multiple_input_menus) {
                if (input == 44 && state.vars.input_menu_loc > 0) {
                    state.vars.input_menu_loc = state.vars.input_menu_loc - 1;
                    var menu = JSON.parse(state.vars.input_menu)[state.vars.input_menu_loc];
                    global.sayText(menu);
                    global.promptDigits(handlerName, {submitOnHash: true, maxDigits: 8, timeout: 5});
                    return null;
                }
                else if (input == 77 && (state.vars.input_menu_loc < state.vars.input_menu_length - 1)) {
                    state.vars.input_menu_loc = state.vars.input_menu_loc + 1;
                    menu = JSON.parse(state.vars.input_menu)[state.vars.input_menu_loc];
                    global.sayText(menu);
                    global.promptDigits(handlerName, {submitOnHash: true, maxDigits: 8, timeout: 5});
                    return null;
                }
            }
            if(isValidBundleInput(input, allVarieties)){
                onVarietyChosen(chosenInput);
            }
        };
    }
};