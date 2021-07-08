var onChangeOrder = require('./onChangeOrder');

/**
 * removes the selected bundle from a list of selected bundles and saves the rest in the state variable
 * @param {String} lang language to be used
 * @param {Number} bundleIdToRemove Id of the bundle to be removed from the list
 */
module.exports = function onRemoveProductSelected(lang, bundleIdToRemove) {
    var selectedBundles = JSON.parse(state.vars.selected_bundles);
    var remainingBundles = selectedBundles.filter(function(selectedBundle) {
        return selectedBundle.bundleId != bundleIdToRemove;
    });
    state.vars.selected_bundles = JSON.stringify(remainingBundles);
    onChangeOrder(lang);
};