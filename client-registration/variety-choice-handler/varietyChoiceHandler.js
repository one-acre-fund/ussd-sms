var handlerName = 'v_choice_handler_enr';

var notifyELK = require('../../notifications/elk-notification/elkNotification');
var chosenInput = [];
function isValidBundleInput(input, bundleInputs){
    
    chosenInput = bundleInputs[input-1];
    if((chosenInput) && (chosenInput.length != 0)){
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
                    global.promptDigits(handlerName);
                    return null;
                }
                else if (input == 77 && (state.vars.input_menu_loc < state.vars.input_menu_length - 1)) {
                    state.vars.input_menu_loc = state.vars.input_menu_loc + 1;
                    menu = JSON.parse(state.vars.input_menu)[state.vars.input_menu_loc];
                    global.sayText(menu);
                    global.promptDigits(handlerName);
                    return null;
                }
            }
            if(isValidBundleInput(input, allVarieties)){
                onVarietyChosen(chosenInput);
            }
        };
    }
};