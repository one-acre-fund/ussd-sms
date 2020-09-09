
/**
 * Checks whether the client has a duka id in the clients table
 * @param {String} officerId client duka officer id
 * @param {String} clientsTable table that contains the clients duka ids
 */
module.exports = function(officerId, clientsTable) {
    var table = project.getOrCreateDataTable(clientsTable);
    var cursor = table.queryRows({vars: {
        'officer_id': officerId
    }});

    if(cursor.hasNext()) {
        return true;
    } else {
        return false;
    }
};