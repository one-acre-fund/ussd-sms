var translations = require('./translations/index');
var translator = require('../utils/translator/translator');

(function main() {
    // This script parses client info
    var client = JSON.parse(contact.vars.client);
    console.log('Received receipt transation for: '+ contact.vars.client);
    state.vars.FirstName = client.FirstName;
    
    // check for language
    var table = project.getOrCreateDataTable('EnglishDistricts');
    var DistrictCursor = table.queryRows({
        vars: {'districtname': client.DistrictName}
    });
    
    DistrictCursor.limit(1);
    
    if (DistrictCursor.hasNext()) {
        state.vars.English = 1;
        state.vars.lang = 'en';
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

    if(balance <= 0) {
        // if the user has paid all credit or over paid
        var shsNotification = getMessage('shs_notification', {}, state.vars.lang);
        project.sendMessage({
            content: shsNotification,
            to_number: contact.phone_number,
        });
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

})();
