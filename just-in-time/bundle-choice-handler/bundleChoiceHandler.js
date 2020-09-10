var handlerName = 'bundle_choice_handler';
var notifyELK = require('../../notifications/elk-notification/elkNotification');

var bundles,chosenBundle =[];

var isValidBundleInputChoice = function(input){
    bundles = JSON.parse(state.vars.bundles);
    chosenBundle = bundles[input-1];
    if((chosenBundle) &&(chosenBundle.length != 0)){
        return true;
    }
    return false;
};
module.exports = {
    handlerName: handlerName,
    getHandler: function(onBundleSelected){
        return function (input) {
            console.log('inside bundle choice handler'+state.vars.bundles);
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
            if(isValidBundleInputChoice(input)){
                onBundleSelected(chosenBundle.bundleId);
            }
        };
    }
};