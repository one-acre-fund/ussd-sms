
var client = JSON.parse(contact.vars.client);
var LoanBalance = 0;
var arrayLength = client.BalanceHistory.length;
for (var i = 0; i < arrayLength; i++) {
    if (client.BalanceHistory[i].Balance > 0) {
        LoanBalance = LoanBalance + client.BalanceHistory[i].Balance;
    }
}

var receipt = getTranslation('payment_receipt_ug', {
    firstName: client.FirstName,
    lastTransaction: contact.vars.lastTransactionAmount,
    balance: earliestBalance
}, 'en')

sendMessage({ 
    "to_number": contact.phone_number,
    "content": receipt
 });