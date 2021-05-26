var getTranslation = require('./translations/index');
var Log = require('../logger/elk/elk-logger');

try{
    var client = JSON.parse(contact.vars.client);
    var TotalLoanBalance = 0;
    var earliestBalance = 0;
    var arrayLength = client.BalanceHistory.length;
    for (var i = 0; i < arrayLength; i++) {
        if (client.BalanceHistory[i].Balance > 0) {
            earliestBalance =client.BalanceHistory[i].Balance; 
            TotalLoanBalance = TotalLoanBalance + client.BalanceHistory[i].Balance;
        }
    }

    var receipt = getTranslation('payment_receipt_ug', {
        firstName: client.FirstName,
        lastTransaction: contact.vars.lastTransactionAmount,
        balance: earliestBalance
    }, 'en');
    sendMessage(contact.phone_number,receipt);
}
catch(ex){
    console.log('#########################error sending message#########################');
    var log = new Log();
    log.error('Failed to send Repayment SMS:', { Message: 'RepaymentSMSError', data: {TAG: 'RepaymentReceiptTRSMSError',exception: ex, country: 'UG',vars: (contact!=null)? contact.vars: null,phoneNumber: (contact != null)? contact.phone_number :null}});
}
