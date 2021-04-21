var bundlesHandler = require('./inputHandlers/bundlesHandler');
var getBundles = require('./utils/getBundles');
var displayBundles = require('./utils/displayBundles');
var registerInputHandlers = require('./inputHandlers/registerInputHandlers');

/**
 * starting enrollment
 * @param {string} language language to be used
 * @param {Object} client client to be enrolled
 */
function start(language, client) {
    // starting enrollment
    try {
        state.vars.enrolling_client = JSON.stringify(client);
    } catch(error) {
        console.log('error' + JSON.stringify({error: error}));
    }
    // get all bundles in a certain district
    var bundles = getBundles(client.DistrictId, language);
    state.vars.selected_bundles = getOrderedBundles(client.AccountNumber);
    state.vars.bundles = JSON.stringify(bundles);
    displayBundles(bundles, language, client);
    global.promptDigits(bundlesHandler.handlerName);
}

function getOrderedBundles(AccountNumber) {
    var ordersTable = project.initDataTableById(service.vars.orders_table_id);
    var cursor = ordersTable.queryRows({
        vars: {
            'account_number': AccountNumber
        }
    });
    var order = JSON.stringify([]);
    if(cursor.hasNext()) {
        var row = cursor.next();
        order = row.vars.order;
    }
    return order;
}

module.exports = {
    start: start,
    registerInputHandlers: registerInputHandlers
};
