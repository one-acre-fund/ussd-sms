/**
 * create the option names to be used for creating screens
 * @param {Object} bundles all bundles to be shown on the screen
 * @returns Object of kye:value pairs of option names
 */
module.exports = function createOptionNamesForBundles(bundles) {
    var optionNames = {};
    (bundles || []).forEach(function(bundle) {
        optionNames[bundle.bundleId] = bundle.bundleName;
    });
    return optionNames;
};
