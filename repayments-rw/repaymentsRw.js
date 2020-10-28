var translator = require('../utils/translator/translator');
var translations = require('./translations/index');
var getHealthyPathPercentage = require('../healthy-path/utils/getHealthyPathPercentage');
var calculateHealthyPath= require('../healthy-path/utils/healthyPathCalculator');

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
var healthyPathPercentage = getHealthyPathPercentage(BalanceHistory && BalanceHistory.SeasonId, client.CountryId, client.DistrictId);
var healthyPath = calculateHealthyPath(healthyPathPercentage, BalanceHistory && BalanceHistory.TotalCredit, BalanceHistory && BalanceHistory.TotalRepayment_IncludingOverpayments);
var hp_dist = healthyPath < 0 || !healthyPath ? '' : getMessage('hp_dist', {'$hp_dist': healthyPath}, 'ki');

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
project.sendMessage({
    content: receipt, 
    to_number: contact.phone_number,
    label_ids: [mmReceiptLabel.id]
});