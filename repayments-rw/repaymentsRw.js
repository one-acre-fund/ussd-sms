var translator = require('../utils/translator/translator');
var translations = require('./translations/index');

var getMessage = translator(translations, 'ki');
// This script parses client info

var client = JSON.parse(contact.vars.client);
console.log('Received receipt transation for: '+contact.vars.client);

var LastName = client.LastName;

// This script prepares the balance information

var arrayLength = client.BalanceHistory.length;
console.log('Number of seasons with a balance: '+arrayLength);
var paid = 0;
    
for (var i = 0; i < arrayLength; i++) {
    if (client.BalanceHistory[i])
    {
        paid = paid + client.BalanceHistory[i] && client.BalanceHistory[i].TotalRepayment_IncludingOverpayments;
    }
}

// sending the actual mm receipt
var transactionLog = '';
var receipt = '';
if(paid == 0) {
    receipt = getMessage('mm_receipt_rw_0_paid', {
        '$LastName': LastName,
        '$lastTransactionAmount': contact.vars.lastTransactionAmount,
        '$lastTransactionId': contact.vars.lastTransactionId,
        '$accountnumber': contact.vars.accountnumber,
    }, 'ki');

    transactionLog = getMessage('mm_receipt_rw_0_paid', {
        '$LastName': LastName,
        '$lastTransactionAmount': contact.vars.lastTransactionAmount,
        '$lastTransactionId': contact.vars.lastTransactionId,
        '$accountnumber': contact.vars.accountnumber
    }, 'en');
} else {
    receipt = getMessage('mm_receipt_rw_paid', {
        '$LastName': LastName,
        '$lastTransactionAmount': contact.vars.lastTransactionAmount,
        '$lastTransactionId': contact.vars.lastTransactionId,
        '$accountnumber': contact.vars.accountnumber,
        '$paid': paid
    }, 'ki');

    transactionLog = getMessage('mm_receipt_rw_paid', {
        '$LastName': LastName,
        '$lastTransactionAmount': contact.vars.lastTransactionAmount,
        '$lastTransactionId': contact.vars.lastTransactionId,
        '$accountnumber': contact.vars.accountnumber,
        '$paid': paid
    }, 'en');
}
var mmReceiptLabel = project.getOrCreateLabel('MM receipt');
console.log(transactionLog);
project.sendMessage({
    content: receipt, 
    to_number: contact.phone_number,
    label_ids: [mmReceiptLabel.id]
});
