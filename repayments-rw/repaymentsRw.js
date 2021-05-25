var translator = require('../utils/translator/translator');
var translations = require('./translations/index');
var getHealthyPathDist = require('../healthy-path/repayments/HealthyPathOnRepaymentReceipts');
var defaultEnvironment; 
if(service.active){
    defaultEnvironment = 'prod';
}else{
    defaultEnvironment = 'dev';
}

var env;
if(service.vars.env === 'prod' || service.vars.env === 'dev'){
    env = service.vars.env;
}else{
    env = defaultEnvironment;
}

service.vars.server_name = project.vars[env + '_server_name'];
service.vars.roster_read_key = project.vars.roster_read_key;

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

// calculating the healthy path
var BalanceHistory = client.BalanceHistory[0];
var hp_dist = getHealthyPathDist(BalanceHistory && BalanceHistory.SeasonId, client.CountryId, client.DistrictId, BalanceHistory && BalanceHistory.TotalCredit, BalanceHistory && BalanceHistory.TotalRepayment_IncludingOverpayments, 'ki');

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
receipt = receipt + hp_dist;
console.log(transactionLog);
console.log('healthy path ' + receipt);
try{
    var messageSent = project.sendMessage({
        content: receipt, 
        to_number: contact.phone_number,
        label_ids: [mmReceiptLabel.id]
    });
    if(messageSent === undefined || messageSent.error_message !== undefined || messageSent.status == 'failed' || messageSent.status == 'cancelled'){
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~error sending message#########################');
    }

}
catch(Exception){
    console.log('qwert~~~~~~~~~~~~~~~~~~~~~~~~~~~~~error sending message#########################');
}


