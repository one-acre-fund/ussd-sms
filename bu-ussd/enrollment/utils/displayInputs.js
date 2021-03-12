var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var createMenu = require('../../../shared/createMenu');

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
module.exports = function displayInputs(lang, selectedBundle) {
    var getMessage = translator(translations, lang);
    var bundleInputs = selectedBundle.bundleInputs;
    var optionNames = createOptionNamesForInputs(bundleInputs);
    var createdMenu = createMenu(optionNames, getMessage('next_screen', {}, lang), bundleInputs.bundleName + '\n');
    state.vars.input_screens = JSON.stringify(createdMenu.screens);
    state.vars.input_option_values = JSON.stringify(createdMenu.optionValues);
    state.vars.current_inputs_menu = '1';
    global.sayText(createdMenu.screens[1]);
};
