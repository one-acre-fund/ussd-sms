/**
 * gets all bundles in a certain district
 * @param {Number} districtId id of the district of the client
 * @param {String} lang language to be used
 * @returns An array of the bundles and bundle inputs offered in that district
 */
module.exports = function getBundles(districtId, lang) {
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
};
