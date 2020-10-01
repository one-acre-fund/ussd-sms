module.exports = function(districtsTableName, client) {

    if(!client) {
        return false;
    }
    var district = client && client.DistrictName;
    var site = client && client.SiteName;
    var table = project.getOrCreateDataTable(districtsTableName);

    var cursor = table.queryRows({
        vars: {
            '1af_district': district,
            'site': site
        }
    });

    if(cursor.hasNext()) {
        // then the client's site is on the prohibited districts
        return false;
    }
    return true;
};
