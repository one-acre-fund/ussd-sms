/**
 * gets client object, update the data table and returns the updated row
 * @param {Object} client client object from roster with uptodate client details
 * @returns Eligibility details
 */
module.exports = function getEligibilityDetails(client) {
    var accountNumber = client.AccountNumber;
    var table = project.initDataTableById(service.vars.credit_eligibility_table_id);
    var cursor = table.queryRows({
        vars: {
            account_number: accountNumber
        }
    });

    if(cursor.hasNext()) {
        // get the details
        var row = cursor.next();
        var eligibilityDetails = {
            min_credit: row.vars.min_credit,
            max_credit: row.vars.max_credit,
            pre_payment: row.vars.prepayment,
            solar: row.vars.solar_eligibility,
            outstanding_amount: row.vars.outstanding_amount,
            reason: row.vars.eligibility_reason,
            eligibility_decision: row.vars.eligibility_decision
        };
        return eligibilityDetails;
    }
    return null;
};
