var createMenu = require('../../../shared/createMenu');
var createOptionNamesForBundles = require('../utils/createOptionNamesForBundles');
var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var onChangeOrderHandler = require('../inputHandlers/onChangeOrderHandler');

/**
 * 
 * @param {String} lang language to be used
 */
module.exports = function onChangeOrder(lang) {
    var getMessage = translator(translations, lang);
    var selectedBundles = JSON.parse(state.vars.selected_bundles);
    var optionNames = createOptionNamesForBundles(selectedBundles);
    var nextScreenOption = getMessage('next_screen', {}, lang);
    var changeOrderTitle = getMessage('change_order_title', {}, lang);

    var bundlesMenu = createMenu(optionNames, nextScreenOption, '', 110);
    Object.keys(bundlesMenu.screens).forEach(function(key) {
        bundlesMenu.screens[key] = changeOrderTitle + bundlesMenu.screens[key];
    });
    state.vars.ordered_bundles_screens = JSON.stringify(bundlesMenu.screens);
    state.vars.ordered_bundles_option_values = JSON.stringify(bundlesMenu.optionValues);
    state.vars.current_ordered_bundles_screen = '1';
    global.sayText(bundlesMenu.screens[state.vars.current_ordered_bundles_screen]);
    global.promptDigits(onChangeOrderHandler.handlerName);
};
