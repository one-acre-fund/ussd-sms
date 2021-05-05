/**
 * Fetches the Bundles from the data table by the district id
 * @returns an array of bundles
 */
module.exports = function getBundles() {
    console.log('>>>>>>table' + service.vars.bundles_table);
    var table = project.initDataTableById(service.vars.bundles_table);
    var query = {
    };
    query['d' + state.vars.client_districtId] = 1;
    var cursor = {};
    if(state.vars.client_districtId) {
        cursor = table.queryRows({
            vars: query
        });
    } else {
        cursor = table.queryRows({
            vars: {
                'bundle_name': {exists: 1}
            }
        });
    }
    var districts = [];
    while(cursor.hasNext()) {
        var row = cursor.next();
        districts.push(row.vars);
    }
    return districts;
};
