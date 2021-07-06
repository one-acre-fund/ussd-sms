
/**
 * Accepts account number and checks if client is listed under the group leaders of the last season 2021B
 * @param {Number} AccountNumber the client's account number
 */
module.exports = function checkForGroupLeader(AccountNumber) {
    var GLsTable = project.initDataTableById(service.vars.group_leaders_table);
    var cursor = GLsTable.queryRows({
        vars: {
            account_number: AccountNumber
        }
    });

    if(cursor.hasNext()) {
        return true;
    }
    return false;
};
