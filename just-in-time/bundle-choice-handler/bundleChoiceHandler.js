var handlerName = 'bundle_choice_handler';
//var translations = require('../translations');
//var createTranslator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
//var translate =  createTranslator(translations, project.vars.lang);

var bundles,chosenBundle =[];

var isValidBundleInputChoice = function(input){
    bundles = JSON.parse(state.vars.bundles);
    console.log('bundle chosen##########:'+JSON.stringify(bundles) + ' length '+ input);
    chosenBundle = bundles[input-1];
    //console.log('bundle chosen:'+JSON.stringify(chosenBundle) + ' length '+ chosenBundle.length);
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
                console.log('isValidBundleInputChoice validated');
                //TO: call bundle inputs
                console.log('has multiple');
                onBundleSelected(chosenBundle.bundleId);
                console.log('bundle Input selected--------:'+JSON.stringify(chosenBundle));
            }
        };
    }
};