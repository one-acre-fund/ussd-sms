var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var getPhoneNumber = require('../shared/rosterApi/getPhoneNumber');
var logger = require('../slack-logger/index');
var validateProjectVatiables = require('./validateProjectVariables');

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
validateProjectVatiables(env);

// This script parses client info
var client = JSON.parse(contact.vars.client);
console.log('Received receipt transaction for: '+ contact.vars.client);
state.vars.FirstName = client.FirstName;
    
// check for language
var table = project.getOrCreateDataTable('EnglishDistricts');
var DistrictCursor = table.queryRows({
    vars: {'districtname': client.DistrictName}
});
    
DistrictCursor.limit(1);
    
if (DistrictCursor.hasNext()) {
    state.vars.English = 1;
    state.vars.lang = 'en-ke';
}else {
    state.vars.lang = 'sw';
    state.vars.English = '0';
}
var getMessage = translator(translations, state.vars.lang);

// This script prepares the balance information
var arrayLength = client.BalanceHistory.length;
var paid = 0;
var balance = 0;
    
for (var i = 0; i < arrayLength; i++) {
    
    if (client.BalanceHistory[i].Balance>0){
   
        paid = paid + client.BalanceHistory[i].TotalRepayment_IncludingOverpayments;
        balance = balance + client.BalanceHistory[i].Balance;
    }
}
var phone_numbers = getPhoneNumber(client.AccountNumber, client.CountryName);
if(balance <= 0) {
    // if the user has paid all credit or over paid
    var shsNotification = getMessage('shs_notification', {}, state.vars.lang);
    if(phone_numbers) {
        var active_phone_numbers = phone_numbers.filter(function(phone_number) {
            return !phone_number.IsInactive;
        });
        project.sendMessage({
            content: shsNotification,
            to_number: active_phone_numbers[0].PhoneNumber,
        });
    } else {
        logger.log('error in shs notification: could not get a to_phone number from roster');
    }
}
var mmReceipt = '';
    

if (client.BalanceHistory[0].TotalRepayment_IncludingOverpayments > client.BalanceHistory[0].TotalCredit){
    var OverpaidAmount = client.BalanceHistory[0].TotalRepayment_IncludingOverpayments - client.BalanceHistory[0].TotalCredit;
    mmReceipt = getMessage('mm_receipt_over_paid', {
        '$FirstName': client.FirstName,
        '$accountnumber': contact.vars.accountnumber,
        '$lastTransactionAmount': contact.vars.lastTransactionAmount,
        '$lastTransactionId': contact.vars.lastTransactionId,
        '$OverpaidAmount': OverpaidAmount
    }, state.vars.lang);
}else{
    mmReceipt = getMessage('mm_receipt', {
        '$FirstName': client.FirstName,
        '$accountnumber': contact.vars.accountnumber,
        '$lastTransactionAmount': contact.vars.lastTransactionAmount,
        '$lastTransactionId': contact.vars.lastTransactionId,
        '$paid': paid,
        '$balance': balance
    }, state.vars.lang);
}

project.sendMessage({
    content: mmReceipt,
    to_number: contact.phone_number,
});

