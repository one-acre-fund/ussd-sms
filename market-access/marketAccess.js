var translations = require('./translations');
var createTranslator = require('../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var quantityHandler = require('./quantity-handler/quantityHandler');
var dateAvailableHandler = require('./date-available-handler/dateAvailableHandler');
var confirmationHandler = require('./confirmation-handler/confirmationHandler');
var paymentAdvanceHandler = require('./payment-advance-handler/paymentAdvanceHandler');
var paymentChoiceHandler = require('./payment-choice-handler/paymentChoiceHandler');
var MOMOHandler = require('./MOMO-handler/MOMOHandler');
var phoneNumberHandler = require('./phone-number-handler/phoneNumberHandler');
var nameHandler = require('./name-handler/nameHandler');
var bankNameHandler = require('./bank-input-handlers/bank-name-handler/bankNameHandler');
var bankBranchHandler = require('./bank-input-handlers/bank-branch-handler/bankBranchHandler');
var bankAccountHandler = require('./bank-input-handlers/bank-account-handler/bankAccountHandler');
var accountNameHandler = require('./bank-input-handlers/account-name-handler/accountNameHandler');
var notifyELK = require('../notifications/elk-notification/elkNotification');
var marketInfo ={};


function onQuantitySubmitted(quantity){
    marketInfo = JSON.parse(state.vars.marketInfo);
    marketInfo.QuantityofMaize  = quantity;
    state.vars.marketInfo = JSON.stringify(marketInfo);
    global.sayText(translate('maize_availability',{},state.vars.marketLang));
    global.promptDigits(dateAvailableHandler.handlerName);
}
function onDateSubmitted(date){
    marketInfo = JSON.parse(state.vars.marketInfo);
    marketInfo.AvailabilityDate = date;
    state.vars.marketInfo = JSON.stringify(marketInfo);
    saveMarketInfo('onDateSubmitted',date);
    global.sayText(translate('details_confirm_menu',{'$amount': marketInfo.QuantityofMaize, '$date': marketInfo.AvailabilityDate},state.vars.marketLang));
    global.promptDigits(confirmationHandler.handlerName);
}
function onConfirmation(confirmed){
    if(confirmed == '0'){
        saveMarketInfo('onConfirmation',confirmed);
        global.sayText(translate('payment_advance',{},state.vars.marketLang));
        global.promptDigits(paymentAdvanceHandler.handlerName);
    }
    else{
        marketInfo = JSON.parse(state.vars.marketInfo);
        global.sayText(translate('details_confirm_menu',{'$amount': marketInfo.QuantityofMaize, '$date': marketInfo.AvailabilityDate},state.vars.marketLang));
        global.promptDigits(confirmationHandler.handlerName);
    }
}
function onAdvancePayment(paymentAdvanceChoice){
    if(paymentAdvanceChoice == 1){
        marketInfo = JSON.parse(state.vars.marketInfo);
        marketInfo.AdvanceRequest = 'Yes';
        state.vars.marketInfo = JSON.stringify(marketInfo);
        saveMarketInfo('onAdvancePayment',paymentAdvanceChoice);
        global.sayText(translate('payment_choice',{},state.vars.marketLang));
        global.promptDigits(paymentChoiceHandler.handlerName);
    }else{
        marketInfo = JSON.parse(state.vars.marketInfo);
        marketInfo.AdvanceRequest = 'No';
        state.vars.marketInfo = JSON.stringify(marketInfo);
        global.sayText(translate('final_thanking_message',{},state.vars.marketLang));
        saveMarketInfo();
    }
}
function onPaymentChoice(paymentChoice){
    if(paymentChoice == 1 ){
        var marketInfo = JSON.parse(state.vars.marketInfo);
        marketInfo.AdvancePaymentOption = 'MOMO';
        state.vars.marketInfo = JSON.stringify(marketInfo);
        saveMarketInfo('onPaymentChoice',paymentChoice);
        global.sayText(translate('MOMO_choice',{},state.vars.marketLang));
        global.promptDigits(MOMOHandler.handlerName);

    }else if(paymentChoice == 2){
        marketInfo = JSON.parse(state.vars.marketInfo);
        marketInfo.AdvancePaymentOption = 'Bank';
        state.vars.marketInfo = JSON.stringify(marketInfo);
        saveMarketInfo('onPaymentChoice',paymentChoice);
        global.sayText(translate('bank_name_menu',{},state.vars.marketLang));
        global.promptDigits(bankNameHandler.handlerName);

    }else if(paymentChoice == 3){
        global.sayText(translate('payment_advance',{},state.vars.marketLang));
        global.promptDigits(paymentAdvanceHandler.handlerName);
    }
}
function onMOMOChosen(input){
    if(input == 1){
        marketInfo = JSON.parse(state.vars.marketInfo);
        marketInfo.AdvancePaymentPhoneOption = 'MTN';
        state.vars.marketInfo = JSON.stringify(marketInfo);
        saveMarketInfo('onMOMOChosen',input);
        global.sayText(translate('phone_number_menu',{},state.vars.marketLang));
        global.promptDigits(phoneNumberHandler.handlerName);
    }else if(input == 2){
        marketInfo = JSON.parse(state.vars.marketInfo);
        marketInfo.AdvancePaymentPhoneOption = 'Airtel';
        state.vars.marketInfo = JSON.stringify(marketInfo);
        saveMarketInfo('onMOMOChosen',input);
        global.sayText(translate('phone_number_menu',{},state.vars.marketLang));
        global.promptDigits(phoneNumberHandler.handlerName);
    }
    else if(input == 3){
        global.sayText(translate('payment_choice',{},state.vars.marketLang));
        global.promptDigits(paymentChoiceHandler.handlerName);
    }
}
function onPhoneSubmitted(phoneNumber){
    marketInfo = JSON.parse(state.vars.marketInfo);
    marketInfo.AdvancePhoneNumber  = phoneNumber;
    state.vars.marketInfo = JSON.stringify(marketInfo);
    saveMarketInfo('onPhoneSubmitted',phoneNumber);
    global.sayText(translate('farmer_name_menu',{},state.vars.marketLang));
    global.promptDigits(nameHandler.handlerName);
}
function onNameSubmitted(name){
    marketInfo = JSON.parse(state.vars.marketInfo);
    marketInfo.AdvanceClientName = name;
    state.vars.marketInfo = JSON.stringify(marketInfo);
    var finalMessage = translate('final_message_momo',{'$name': marketInfo.AdvanceClientName, '$phone': marketInfo.AdvancePhoneNumber},state.vars.marketLang);
    global.sayText(finalMessage);
    project.sendMessage({
        content: finalMessage,
        to_number: contact.phone_number
    });
    saveMarketInfo();
}
function onBankNameSubmitted(bankName){
    marketInfo = JSON.parse(state.vars.marketInfo);
    marketInfo.BankName  = bankName;
    state.vars.marketInfo = JSON.stringify(marketInfo);
    saveMarketInfo('onBankNameSubmitted',bankName);
    global.sayText(translate('bank_branch_menu',{},state.vars.marketLang));
    global.promptDigits(bankBranchHandler.handlerName);
}
function onBankBranchSubmitted(bankBranchName){
    marketInfo = JSON.parse(state.vars.marketInfo);
    marketInfo.BankBranch = bankBranchName;
    state.vars.marketInfo = JSON.stringify(marketInfo);
    saveMarketInfo('onBankBranchSubmitted',bankBranchName);
    global.sayText(translate('bank_account_menu',{},state.vars.marketLang));
    global.promptDigits(bankAccountHandler.handlerName);
}
function onBankAccountSubmitted(bankAccountNumber){
    marketInfo = JSON.parse(state.vars.marketInfo);
    marketInfo.ClientBankAccountNumber  = bankAccountNumber;
    state.vars.marketInfo = JSON.stringify(marketInfo);
    saveMarketInfo('onBankAccountSubmitted',bankAccountNumber);
    global.sayText(translate('bank_account_name',{},state.vars.marketLang));
    global.promptDigits(accountNameHandler.handlerName);
}
var onAccountNameSubmitted = function(bankAccountName){
    marketInfo = JSON.parse(state.vars.marketInfo);
    marketInfo.ClientAccountName = bankAccountName;
    state.vars.marketInfo = JSON.stringify(marketInfo);
    var finalMessage = translate('bank_final_confirmation',{'$account': marketInfo.ClientBankAccountNumber, '$name': marketInfo.ClientAccountName,'$bankName': marketInfo.BankName},state.vars.marketLang);
    project.sendMessage({
        content: finalMessage,
        to_number: contact.phone_number
    });
    global.sayText(finalMessage);
    saveMarketInfo();
};
function saveMarketInfo(callback,callBackInput){
    marketInfo = JSON.parse(state.vars.marketInfo);
    if(callback){
        marketInfo.currentCallback = callback;
        marketInfo.currentCallBackInput = callBackInput;
        marketInfo.finalized = 0;
    }
    else{
        marketInfo.finalized = 1;
    }
    var table  = project.initDataTableById(service.vars.market_access_table);
    var cursor = table.queryRows({'vars': {'account': state.vars.account}});
    if(cursor.hasNext()){
        var row = cursor.next();
        row.vars = marketInfo;
    }
    else{
        row = table.createRow({'vars': marketInfo});
    }
    row.save();
}
function hasFinalized(accountNumber){
    var table  = project.initDataTableById(service.vars.market_access_table);
    var cursor = table.queryRows({'vars': {'account': accountNumber,'finalized': 1}});
    if(cursor.hasNext()){
        var row = cursor.next();
        state.vars.marketInfo = JSON.stringify(row.vars);
        return true;
    }
    return false;
}
function resume(accountNumber){
    var table  = project.initDataTableById(service.vars.market_access_table);
    var cursor = table.queryRows({'vars': {'account': accountNumber,'finalized': 0}});
    if(cursor.hasNext()){
        var row = cursor.next();
        state.vars.marketInfo = JSON.stringify(row.vars);
        return true;
    }
    return false;

}
module.exports = {
    registerHandlers: function(){
        addInputHandler(quantityHandler.handlerName, quantityHandler.getHandler(onQuantitySubmitted));
        addInputHandler(dateAvailableHandler.handlerName, dateAvailableHandler.getHandler(onDateSubmitted));
        addInputHandler(confirmationHandler.handlerName,confirmationHandler.getHandler(onConfirmation));
        addInputHandler(paymentAdvanceHandler.handlerName, paymentAdvanceHandler.getHandler(onAdvancePayment));
        addInputHandler(paymentChoiceHandler.handlerName, paymentChoiceHandler.getHandler(onPaymentChoice));
        addInputHandler(MOMOHandler.handlerName, MOMOHandler.getHandler(onMOMOChosen));
        addInputHandler(phoneNumberHandler.handlerName, phoneNumberHandler.getHandler(onPhoneSubmitted));
        addInputHandler(nameHandler.handlerName, nameHandler.getHandler(onNameSubmitted));
        addInputHandler(bankNameHandler.handlerName, bankNameHandler.getHandler(onBankNameSubmitted));
        addInputHandler(bankBranchHandler.handlerName, bankBranchHandler.getHandler(onBankBranchSubmitted));
        addInputHandler(bankAccountHandler.handlerName, bankAccountHandler.getHandler(onBankAccountSubmitted));
        addInputHandler(accountNameHandler.handlerName, accountNameHandler.getHandler(onAccountNameSubmitted));
       
    },
    start: function (clientJSON, country, lang) {
        notifyELK();
        state.vars.account = clientJSON.AccountNumber;
        state.vars.country = country;
        state.vars.marketLang = lang;
        state.vars.marketInfo = JSON.stringify({account: clientJSON.AccountNumber, districtName: clientJSON.DistrictName, siteName: clientJSON.SiteName });
        var translate =  createTranslator(translations, state.vars.marketLang);
        if(hasFinalized(clientJSON.AccountNumber)){
            global.sayText(translate('finalized',{'$number': JSON.parse(state.vars.marketInfo).QuantityofMaize, '$date': JSON.parse(state.vars.marketInfo).AvailabilityDate}));
            global.stopRules();
        }else if(resume(clientJSON.AccountNumber)) {
            console.log(state.vars.marketInfo);
            var currentCallback = ''+JSON.parse(state.vars.marketInfo).currentCallback +'(\''+JSON.parse(state.vars.marketInfo).currentCallBackInput + '\')';
            console.log(currentCallback);
            eval(currentCallback); 
        }
        else{
            global.sayText(translate('quantity_unshield_maize',{}));
            global.promptDigits(quantityHandler.handlerName);
        }
    
    }  
};