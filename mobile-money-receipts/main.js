const getTranslation = require('./translations/index');
var client = JSON.parse(contact.vars.client);
var TotalLoanBalance = 0;
var earliestBalance = 0;
var arrayLength = client.BalanceHistory.length;
for (var i = 0; i < arrayLength; i++) {
    if (client.BalanceHistory[i].Balance > 0) {
        earliestBalance =client.BalanceHistory[i].Balance 
        TotalLoanBalance = TotalLoanBalance + client.BalanceHistory[i].Balance;
    }
}

var receipt = getTranslation('payment_receipt_ug', {
    firstName: client.FirstName,
    lastTransaction: contact.vars.lastTransactionAmount,
    balance: earliestBalance
}, 'en')
sendMessage(contact.phone_number,receipt);