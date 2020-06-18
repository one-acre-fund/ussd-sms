
var client = JSON.parse(contact.vars.client);
var LoanBalance = 0;
var arrayLength = client.BalanceHistory.length;
for (var i = 0; i < arrayLength; i++) {
    if (client.BalanceHistory[i].Balance > 0) {
        LoanBalance = LoanBalance + client.BalanceHistory[i].Balance;
    }
}


var receipt = "Hello " + client.FirstName + ", You have paid OAF " + contact.vars.lastTransactionAmount + ". Your Loan Balance is now " + LoanBalance + ". For questions, call 0800388889. Thank You!";
sendMessage({ 
    "to_number": contact.phone_number,
    "content" : receipt
 });