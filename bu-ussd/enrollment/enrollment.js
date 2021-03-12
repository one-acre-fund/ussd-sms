var bundlesHandler = require('./inputHandlers/bundlesHandler');
var getBundles = require('./utils/getBundles');
var displayBundles = require('./utils/displayBundles');

/**
 * starting enrollment
 * @param {string} language language to be used
 * @param {Object} client client to be enrolled
 */
function start(language, client) {
    // starting enrollment
    state.vars.enrolling_client = JSON.stringify(client);
    // get all bundles in a certain district
    var bundles = getBundles(client.DistrictId, language);
    state.vars.selected_bundles = JSON.stringify([]);
    state.vars.bundles = JSON.stringify(bundles);
    displayBundles(bundles);
    global.promptDigits(bundlesHandler.handlerName);
}

module.exports = {
    start: start
};
