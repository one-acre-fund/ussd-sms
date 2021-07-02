var getBundles = require('./getBundles');
var displayBundles = require('./displayBundles');
var bundlesHandler = require('../inputHandlers/bundlesHandler');

module.exports = function onKeepOrdering(lang) {
    var client = JSON.parse(state.vars.enrolling_client);
    var bundles = getBundles(client.DistrictId, lang);
    displayBundles(bundles, lang, client);
    global.promptDigits(bundlesHandler.handlerName);
};
