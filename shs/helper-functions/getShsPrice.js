/**
 * Calculates the price of the shs basing on the provided credit cycle (Rwanda only currently)
 * @param {String} currentCreditCycle the credit cycle that a client is registering
 * @returns price of the shs unit | 20000 if no match
 */
module.exports = function getShsPrice(currentCreditCycle) {
    var shsPricesTable = project.initDataTableById(service.vars.shsPricesTableId);
    var shsCursor = shsPricesTable.queryRows({
        vars: {
            credit_cycle_name: currentCreditCycle
        }
    });
    if(shsCursor.hasNext()) {
        var shsRow = shsCursor.next();
        return shsRow.vars.shs_price;
    }
    return 20000;
};