var translations = require('./translations/index');
var translator = require('../../utils/translator/translator');
var orderOrFinalizeHandler = require('../inputHandlers/orderOrFinalizeHandler');

/**
 * handling the quantity selected
 * @param {string} lang language to be used
 * @param {Number} quantity quantity chosen
 */
module.exports = function onQuantitySelected(lang, quantity) {
    var getMessage = translator(translations, lang);
    // add the quantity to the bundle object and prompt for add product or confirm order and finalize
    var selectedBundles = JSON.parse(state.vars.selected_bundles);
    selectedBundles[0].bundleInputs[0].quantity = quantity;
    state.vars.selected_bundles = JSON.stringify(selectedBundles);
    // prompt for continue ordering or finalize
    global.sayText(getMessage('order_or_finalize', {}, lang));
    global.promptDigits(orderOrFinalizeHandler.handlerName);
};
