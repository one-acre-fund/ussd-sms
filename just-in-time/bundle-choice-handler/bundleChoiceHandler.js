var handlerName = 'bundle_choice_handler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var translate =  createTranslator(translations, project.vars.lang);

var bundles, bundleID;
var hasMultipleBundleInput = function(){
    var bundleInputs = JSON.parse(state.vars.bundleInputs);
    var results = [];
    for(var i=0; i<bundleInputs.length-1; i++) {
        if(bundleInputs[i].bundleID == bundleID){
            results.push(bundleInputs[i].value);
        }
    }
    if(results.length > 1){
        return true;
    }
    return false;
};

var isValidBundleInputChoice = function(input){
    bundles = JSON.parse(state.vars.bundles);
    bundleID = bundles[input-1];
    return bundleID;
};
module.exports = {
    handlerName: handlerName,
    getHandler: function(onBundleSelected){
        return function (input) {
            notifyELK();
            if (state.vars.multiple_input_menus) {
                if (input == 44 && state.vars.input_menu_loc > 0) {
                    state.vars.input_menu_loc = state.vars.input_menu_loc - 1;
                    var menu = JSON.parse(state.vars.input_menu)[state.vars.input_menu_loc];
                    sayText(menu);
                    promptDigits(handlerName, {submitOnHash: true, maxDigits: 8, timeout: 5});
                    return null;
                }
                else if (input == 77 && (state.vars.input_menu_loc < state.vars.input_menu_length - 1)) {
                    state.vars.input_menu_loc = state.vars.input_menu_loc + 1;
                    menu = JSON.parse(state.vars.input_menu)[state.vars.input_menu_loc];
                    sayText(menu);
                    promptDigits(handlerName, {submitOnHash: true, maxDigits: 8, timeout: 5});
                    return null;
                }
            }
            else if(isValidBundleInputChoice(input)){
                if(hasMultipleBundleInput()){
                    //TO: call bundle inputs
                    console.log('has multiple');
                }
                else{
                    //Call order confirmation handler
                    onBundleSelected(bundleID);
                }
                //onAccountNumberValidated();
            }
            else{
                global.sayText(translate('bundle_choice_handler',{},state.vars.jitLang));
                global.promptDigits(handlerName);
            }
        };
    }
};