var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var createMenu = require('../../../shared/createMenu');
var createOptionNamesForBundles = require('../utils/createOptionNamesForBundles');
/**
 * displays the bundles on the screen
 * @param {Array} bundles all the bundles to be displayed
 */
module.exports = function displayBundles(bundles, lang, client) {
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
        '$lastName': client.LastName
    }, lang);
    var createdMenu = createMenu(optionNames, getMessage('next_screen', {}, lang), bundlesTitle);
    state.vars.bundles_screens = JSON.stringify(createdMenu.screens);
    state.vars.bundles_option_values = JSON.stringify(createdMenu.optionValues);
    state.vars.current_bundles_menu = '1';
    global.sayText(createdMenu.screens[1]);
};
