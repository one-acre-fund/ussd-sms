var getShsPrice = require('./getShsPrice');
/**
 * returns whether the client is requesting UNLOCK or ACTIVATION code  
 * @param {String} country client's country
 * @param {Object} BalanceHistory client's balance history details for a specific season
 * @returns ACTIVATION | UNLOCK
 */
module.exports = function getkeyCodeType(country, BalanceHistory) {
    var UNLOCK = 'UNLOCK';
    var ACTIVATION = 'ACTIVATION';
    var currentCreditCycle = [];
    currentCreditCycle = BalanceHistory.TotalCreditPerCycle && Object.keys(BalanceHistory.TotalCreditPerCycle);

    var shsUnitPrice = getShsPrice(currentCreditCycle[currentCreditCycle.length - 1]);

    var activationType =  {
        'KE': BalanceHistory.Balance <= 0 ? UNLOCK : ACTIVATION,
        'RW': ((BalanceHistory.TotalRepayment_IncludingOverpayments - BalanceHistory.TotalCredit) >= shsUnitPrice) || 
        (BalanceHistory.TotalCredit <= shsUnitPrice && BalanceHistory.TotalRepayment_IncludingOverpayments == shsUnitPrice) ? UNLOCK : ACTIVATION
    };
    return activationType[country];
};