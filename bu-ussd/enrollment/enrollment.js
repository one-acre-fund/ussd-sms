var translations = require('./translations/index');
var translator = require('../../utils/translator/translator');
var createMenu = require('../../shared/createMenu');
var bundlesHandler = require('./inputHandlers/bundlesHandler');
var bundleInputsHandler = require('./inputHandlers/bundleInputsHandler');
var quantityHandler = require('./inputHandlers/quantityHandler');

/**
 * starting enrollment
 * @param {string} language language to be used
 * @param {Object} client client to be enrolled
 */
function start(language, client) {
    // starting enrollment

    // get all bundles in a certain district
    var bundles = getBundles(client.DistrictId, language);
    state.vars.selected_bundles = JSON.stringify([]);
    state.vars.bundles = JSON.stringify(bundles);
    displayBundles(bundles);
    global.promptDigits(bundlesHandler.handlerName);
}


function onQuantitySelected(lang, quantity) {
    // add the quantity to the bundle object and prompt for add product or confirm order and finalize
}

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
    var bundleInputs = selectedBundle.bundleInputs;
    var getMessage = translator(translations, lang);
    var optionNames = createOptionNamesForInputs(bundleInputs);
    var createdMenu = createMenu(optionNames, getMessage('next_screen', {}, lang), bundleInputs.bundleName + '\n');
    state.vars.input_screens = JSON.stringify(createdMenu.screens);
    state.vars.input_option_values = JSON.stringify(createdMenu.optionValues);
    state.vars.current_inputs_menu = '1';
    global.sayText(createdMenu.screens[1]);
}

/**
 * handles what happens after a bundle is selected 
 * @param {String} lang language to be sued
 * @param {Object} selectedBundle bundle selected by the user
 */
function onBundleSelected(lang, selectedBundle) {
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
}

/**
 * create the option names to be used for creating screens
 * @param {Object} bundles all bundles to be shown on the screen
 * @returns Object of kye:value pairs of option names
 */
function createOptionNamesForBundles(bundles) {
    var optionNames = {};
    bundles.forEach(function(bundle) {
        optionNames[bundle.bundleId] = bundle.bundleName;
    });
    return optionNames;
}

/**
 * displays the bundles on the screen
 * @param {Array} bundles all the bundles to be displayed
 */
function displayBundles(bundles, lang, client) {
    // remove the laready ordered bundles
    var selectedBundles = JSON.parse(state.vars.selected_bundles);
    var selectedBundlesIds = selectedBundles.map(function(selectedBundle){
        return selectedBundle.bundleId;
    });
    var remainingBundles = bundles.filter(function(bundle) {
        return selectedBundlesIds.indexOf(bundle.bundleId) == -1;
    });
    var getMessage = translator(translations, lang);
    var optionNames = createOptionNamesForBundles(remainingBundles);
    var bundlesTitle = getMessage('bundles_title', {
        '$firstName': client.FirstName,
        'lastName': client.lastName
    }, lang);
    var createdMenu = createMenu(optionNames, getMessage('next_screen', {}, lang), bundlesTitle);
    state.vars.bundles_screens = JSON.stringify(createdMenu.screens);
    state.vars.bundles_option_values = JSON.stringify(createdMenu.optionValues);
    state.vars.current_bundles_menu = '1';
    global.sayText(createdMenu.screens[1]);
}


/**
 * gets all bundles in a certain district
 * @param {Number} districtId id of the district of the client
 * @param {String} lang language to be used
 * @returns An array of the bundles and bundle inputs offered in that district
 */
function getBundles(districtId, lang) {
    var bundlesTableId = service.vars.bundles_table_id;
    var bundlesTableInstance = project.initDataTableById(bundlesTableId);
    var query = {
        'offered': '1'
    };
    query['d' + districtId] = '1';
    var bundlesCursor = bundlesTableInstance.queryRows({
        vars: query
    });
    var bundlesObj = {};
    while(bundlesCursor.hasNext()) {
        var bundleRow = bundlesCursor.next();
        if(!bundlesObj[bundleRow.vars.bundle_id]) {
            bundlesObj[bundleRow.vars.bundle_id] = {
                bundleName: bundleRow.vars['bundle_name_' + lang],
                bundleId: parseInt(bundleRow.vars.bundle_id),
                bundleInputs: [{
                    inputName: bundleRow.vars['input_name_' + lang],
                    bundleInputId: parseInt(bundleRow.vars.bundle_input_id),
                    max: bundleRow.vars.max,
                    price: parseInt(bundleRow.vars.price),
                    unit: bundleRow.vars.unit
                }]
            }; 
        } else {
            bundlesObj[bundleRow.vars.bundle_id].bundleInputs.push({
                inputName: bundleRow.vars['input_name_' + lang],
                bundleInputId: parseInt(bundleRow.vars.bundle_input_id),
                max: bundleRow.vars.max,
                price: parseInt(bundleRow.vars.price),
                unit: bundleRow.vars.unit
            });
        }
    }
    var bundles = Object.keys(bundlesObj).map(function(objKey) {
        return bundlesObj[objKey];
    });
    return bundles;
}