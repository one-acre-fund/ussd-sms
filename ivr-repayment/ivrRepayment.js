var validateClient = require('./validateClient');
var triggerPayment = require('../shared/rosterApi/rosterColRequest');

module.exports = function(phoneNumber, paymentAmount, accountNumber) {
    var client = validateClient(accountNumber);
    if(client) {
        var paymentTriggered = triggerPayment(accountNumber, paymentAmount, phoneNumber);
        if(paymentTriggered) {
            return true;
        }
        return false;
    }
    return false;
};
