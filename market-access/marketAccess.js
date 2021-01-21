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
    marketInfo.quantity = quantity;
    state.vars.marketInfo = JSON.stringify(marketInfo);
    marketInfo.quantity = quantity;
    global.sayText(translate('maize_availability',{},state.vars.marketLang));
    global.promptDigits(dateAvailableHandler.handlerName);
}
function onDateSubmitted(date){
    marketInfo = JSON.parse(state.vars.marketInfo);
    marketInfo.date = date;
    state.vars.marketInfo = JSON.stringify(marketInfo);
    global.sayText(translate('details_confirm_menu',{'$amount': marketInfo.quantity, '$date': marketInfo.date},state.vars.marketLang));
    global.promptDigits(confirmationHandler.handlerName);
}
function onConfirmation(confirmed){
    if(confirmed){
        global.sayText(translate('payment_advance',{},state.vars.marketLang));
        global.promptDigits(paymentAdvanceHandler.handlerName);
    }
    else{
        global.sayText(translate('details_confirm_menu',{'$amount': marketInfo.quantity, '$date': marketInfo.date},state.vars.marketLang));
        global.promptDigits(confirmationHandler.handlerName);
    }
}
function onAdvancePayment(paymentAdvanceChoice){
    if(paymentAdvanceChoice == 1){
        marketInfo = JSON.parse(state.vars.marketInfo);
        marketInfo.paymentAdvanceChoice = 'True';
        state.vars.marketInfo = JSON.stringify(marketInfo);
        global.sayText(translate('payment_choice',{},state.vars.marketLang));
        global.promptDigits(paymentChoiceHandler.handlerName);
    }
}
function onPaymentChoice(paymentChoice){
    if(paymentChoice == 1 ){
        var marketInfo = JSON.parse(state.vars.marketInfo);
        marketInfo.paymentAdvanceChoice = 'MOMO';
        state.vars.marketInfo = JSON.stringify(marketInfo);
        global.sayText(translate('MOMO_choice',{},state.vars.marketLang));
        global.promptDigits(MOMOHandler.handlerName);

    }else if(paymentChoice == 2){
        marketInfo = JSON.parse(state.vars.marketInfo);
        marketInfo.paymentAdvanceChoice = 'Bank';
        state.vars.marketInfo = JSON.stringify(marketInfo);
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
        marketInfo.MOMOChoice = 'MTN';
        state.vars.marketInfo = JSON.stringify(marketInfo);
        global.sayText(translate('phone_number_menu',{},state.vars.marketLang));
        global.promptDigits(phoneNumberHandler.handlerName);
    }else if(input == 2){
        marketInfo = JSON.parse(state.vars.marketInfo);
        marketInfo.MOMOChoice = 'Airtel';
        state.vars.marketInfo = JSON.stringify(marketInfo);
        global.sayText(translate('phone_number_menu',{},state.vars.marketLang));
        global.promptDigits(phoneNumberHandler.handlerName);
    }
}
function onPhoneSubmitted(phoneNumber){
    marketInfo = JSON.parse(state.vars.marketInfo);
    marketInfo.phoneNumber = phoneNumber;
    state.vars.marketInfo = JSON.stringify(marketInfo);
    global.sayText(translate('farmer_name_menu',{},state.vars.marketLang));
    global.promptDigits(nameHandler.handlerName);
}
function onNameSubmitted(name){
    marketInfo = JSON.parse(state.vars.marketInfo);
    marketInfo.name = name;
    state.vars.marketInfo = JSON.stringify(marketInfo);
    var finalMessage = translate('final_message_momo',{'$name': marketInfo.name, '$phone': marketInfo.phoneNumber},state.vars.marketLang);
    global.sayText(finalMessage);
    project.sendMessage({
        content: finalMessage,
        to_number: contact.phone_number
    });
    saveMarketInfo();
}
function onBankNameSubmitted(bankName){
    marketInfo = JSON.parse(state.vars.marketInfo);
    marketInfo.bankName = bankName;
    state.vars.marketInfo = JSON.stringify(marketInfo);
    global.sayText(translate('bank_branch_menu',{},state.vars.marketLang));
    global.promptDigits(bankBranchHandler.handlerName);
}
function onBankBranchSubmitted(bankBranchName){
    marketInfo = JSON.parse(state.vars.marketInfo);
    marketInfo.bankBranchName = bankBranchName;
    state.vars.marketInfo = JSON.stringify(marketInfo);
    global.sayText(translate('bank_account_menu',{},state.vars.marketLang));
    global.promptDigits(bankAccountHandler.handlerName);
}
function onBankAccountSubmitted(bankAccountNumber){
    marketInfo = JSON.parse(state.vars.marketInfo);
    marketInfo.bankAccountNumber = bankAccountNumber;
    state.vars.marketInfo = JSON.stringify(marketInfo);
    global.sayText(translate('bank_account_name',{},state.vars.marketLang));
    global.promptDigits(accountNameHandler.handlerName);
}
function onAccountNameSubmitted(bankAccountName){
    marketInfo = JSON.parse(state.vars.marketInfo);
    marketInfo.bankAccountName = bankAccountName;
    state.vars.marketInfo = JSON.stringify(marketInfo);
    var finalMessage = translate('bank_final_confirmation',{'$account': marketInfo.bankAccountNumber, '$name': marketInfo.bankAccountName},state.vars.marketLang);
    project.sendMessage({
        content: finalMessage,
        to_number: contact.phone_number
    });
    global.sayText(finalMessage);
    saveMarketInfo();
}
function saveMarketInfo(){
    console.log(JSON.stringify(state.vars.marketInfo));
    var table  = project.initDataTableById(service.vars.market_access_table);
    var row = table.createRow({'vars': marketInfo});
    row.save();

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
    start: function (account, country, lang) {
        notifyELK();
        state.vars.account = account;
        state.vars.country = country;
        state.vars.marketLang = lang;
        state.vars.marketInfo = JSON.stringify({account: account});
        var translate =  createTranslator(translations, state.vars.marketLang);
        global.sayText(translate('quantity_unshield_maize',{}));
        global.promptDigits(quantityHandler.handlerName);
    
    }  
};