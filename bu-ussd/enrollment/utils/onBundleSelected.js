var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var createMenu = require('../../../shared/createMenu');
var bundleInputsHandler = require('../inputHandlers/bundleInputsHandler');
var quantityHandler = require('../inputHandlers/quantityHandler');

/**
 * handles what happens after a bundle is selected 
 * @param {String} lang language to be sued
 * @param {Object} selectedBundle bundle selected by the user
 */
module.exports = function onBundleSelected(lang, selectedBundle) {
    var selectedBundles = JSON.parse(state.vars.selected_bundles);
    selectedBundles.unshift(selectedBundle);
    state.vars.selected_bundles = JSON.stringify(selectedBundles);
    if(selectedBundle.bundleInputs.length > 1) {
        // means there are more than one inputs/ show them as varieties
        displayInputs(selectedBundle);
        global.promptDigits(bundleInputsHandler.handlerName);
    } else {
        var getMessage = translator(translations, lang);
        // ask for quantity
        global.sayText(getMessage('enter_quantity', {
            '$unit': selectedBundle.bundleInputs[0].unit,
            '$bundleInput': selectedBundle.bundleInputs[0].inputName
        }, lang));
        global.promptDigits(quantityHandler.handlerName);
    }
};

/**
 * creates the option names to be used for creating inputs screens
 * @param {Array} inputs all bundle inputs to be displayed
 * @returns object of key:value pairs of inputs
 */
function createOptionNamesForInputs(inputs) {
    var optionNames = {};
    inputs.forEach(function(input) {
        optionNames[input.bundleInputId] = input.inputName;
    });
    return optionNames;
}

/**
 * displays the inputs on the screen
 * @param {Array} inputs all the inputs to be displayed
 */
function displayInputs(lang, selectedBundle) {
    var getMessage = translator(translations, lang);
    var bundleInputs = selectedBundle.bundleInputs;
    var optionNames = createOptionNamesForInputs(bundleInputs);
    var createdMenu = createMenu(optionNames, getMessage('next_screen', {}, lang), bundleInputs.bundleName + '\n');
    state.vars.input_screens = JSON.stringify(createdMenu.screens);
    state.vars.input_option_values = JSON.stringify(createdMenu.optionValues);
    state.vars.current_inputs_menu = '1';
    global.sayText(createdMenu.screens[1]);
}
