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
var nationalIdHandler = require('./non-client-handlers/national-id-handler/nationalIDHandler');
var farmerNamesHandler = require('./non-client-handlers/farmer-names-handler/farmerNamesHandler');
var farmerDistrictHandler = require('./non-client-handlers/farmer-district-handler/farmerDistrictHandler');
var farmerSiteHandler = require('./non-client-handlers/farmer-site-handler/farmerSiteHandler');
var marketAccessHandler = require('./inputHandlers/marketAccessHandler');
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
function onNationalIdSubmitted(nationalId){
    state.vars.nationalId = nationalId;
    if(hasFinalized(nationalId, true)){
        global.sayText(translate('finalized',{'$number': JSON.parse(state.vars.marketInfo).QuantityofMaize, '$date': JSON.parse(state.vars.marketInfo).AvailabilityDate}));
        global.stopRules();
    }else if(resume(nationalId, true)) {
        console.log(state.vars.marketInfo);
        var currentCallback = ''+JSON.parse(state.vars.marketInfo).currentCallback +'(\''+JSON.parse(state.vars.marketInfo).currentCallBackInput + '\')';
        console.log(currentCallback);
        eval(currentCallback); 
    }
    else{
        marketInfo = JSON.parse(state.vars.marketInfo);
        marketInfo.nationalId  = nationalId;
        state.vars.marketInfo = JSON.stringify(marketInfo);
        global.sayText(translate('farmers_name',{}));
        global.promptDigits(farmerNamesHandler.handlerName);
    }
}
function onFNameSubmitted(names){
    marketInfo = JSON.parse(state.vars.marketInfo);
    marketInfo.clientName  =  names;
    state.vars.marketInfo = JSON.stringify(marketInfo);
    saveMarketInfo('onFNameSubmitted',names);
    global.sayText(translate('farmers_district',{}));
    global.promptDigits(farmerDistrictHandler.handlerName);
}
function onDistrictSubmitted(district){
    marketInfo = JSON.parse(state.vars.marketInfo);
    marketInfo.districtName  =  district;
    state.vars.marketInfo = JSON.stringify(marketInfo);
    saveMarketInfo('onDistrictSubmitted',district);
    global.sayText(translate('farmers_site',{}));
    global.promptDigits(farmerSiteHandler.handlerName);
}
function onSiteSubmitted(site){
    marketInfo = JSON.parse(state.vars.marketInfo);
    marketInfo.siteName  =  site;
    state.vars.marketInfo = JSON.stringify(marketInfo);
    saveMarketInfo('onSiteSubmitted',site);
    global.sayText(translate('quantity_unshield_maize',{}));
    global.promptDigits(quantityHandler.handlerName);
}
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
    var query;
    if(state.vars.nonClient == 'false'){
        query = {'vars': {'account': state.vars.account}};
    }else{
        query = {'vars': {'nationalId': state.vars.nationalId}};
    }
    var cursor = table.queryRows(query);
    if(cursor.hasNext()){
        var row = cursor.next();
        row.vars = marketInfo;
    }
    else{
        row = table.createRow({'vars': marketInfo});
    }
    row.save();
}
function hasFinalized(number, nonClient){
    var table  = project.initDataTableById(service.vars.market_access_table);
    var query = {'vars': {'account': number,'finalized': 1}};
    if(nonClient)
        query = {'vars': {'nationalId': number,'finalized': 1}};
    var cursor = table.queryRows(query);
    if(cursor.hasNext()){
        var row = cursor.next();
        state.vars.marketInfo = JSON.stringify(row.vars);
        return true;
    }
    return false;
}
function resume(number, nonClient){
    var table  = project.initDataTableById(service.vars.market_access_table);
    var query = {'vars': {'account': number,'finalized': 0}};
    if(nonClient)
        query = {'vars': {'nationalId': number,'finalized': 0}};
    var cursor = table.queryRows(query);
    if(cursor.hasNext()){
        var row = cursor.next();
        state.vars.marketInfo = JSON.stringify(row.vars);
        return true;
    }
    return false;
}
function onMarketAccessOptionChosen(choosenOption) {
    notifyELK();
    var lang = state.vars.marketLang;
    var translate =  createTranslator(translations, {}, state.vars.marketLang);
    if(choosenOption == '1') {
        // OAF buying prices
        global.sayText(translate('oaf_buying_prices', {}, lang));
    } else if(choosenOption == '2') {
        // nearest market agent locator
        global.sayText(translate('market_access_locator', {}, lang));
    } else if(choosenOption == '3') {
        // commitment (already existing)
        if(state.vars.nonClient == 'false') {
            // client
            var clientJSON = JSON.parse(state.vars.marketInfo);
            if(hasFinalized(clientJSON.account)){
                global.sayText(translate('finalized',
                    {
                        '$number': JSON.parse(state.vars.marketInfo).QuantityofMaize,
                        '$date': JSON.parse(state.vars.marketInfo).AvailabilityDate
                    }, lang));
                global.stopRules();
            }else if(resume(clientJSON.account)) {
                console.log(state.vars.marketInfo);
                var currentCallback = ''+JSON.parse(state.vars.marketInfo).currentCallback +'(\''+JSON.parse(state.vars.marketInfo).currentCallBackInput + '\')';
                console.log(currentCallback);
                eval(currentCallback); 
            }
            else{
                global.sayText(translate('quantity_unshield_maize',{}, lang));
                global.promptDigits(quantityHandler.handlerName);
            }
        } else {
            // non client
            global.sayText(translate('national_id_menu',{}));
            global.promptDigits(nationalIdHandler.handlerName);
        }
    } else {
        // wrong option choosen
        global.sayText(translate('market_access_menu',{}, lang));
        global.promptDigits(marketAccessHandler.handlerName);
    }
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
        addInputHandler(nationalIdHandler.handlerName, nationalIdHandler.getHandler(onNationalIdSubmitted));
        addInputHandler(farmerNamesHandler.handlerName, farmerNamesHandler.getHandler(onFNameSubmitted));
        addInputHandler(farmerDistrictHandler.handlerName, farmerDistrictHandler.getHandler(onDistrictSubmitted));
        addInputHandler(farmerSiteHandler.handlerName, farmerSiteHandler.getHandler(onSiteSubmitted));
        addInputHandler(marketAccessHandler.handlerName, marketAccessHandler.getHandler(onMarketAccessOptionChosen));
    },
    start: function (country, lang, clientJSON) {
        notifyELK();
        state.vars.country = country;
        state.vars.marketLang = lang;
        var translate =  createTranslator(translations, state.vars.marketLang);
        if(clientJSON) {
            // user is a OAF client
            state.vars.account = clientJSON.AccountNumber;
            state.vars.nonClient = 'false';
            state.vars.marketInfo = JSON.stringify({
                account: clientJSON.AccountNumber, 
                districtName: clientJSON.DistrictName, 
                siteName: clientJSON.SiteName, 
                clientName: clientJSON.FirstName +' '+ clientJSON.LastName
            });
        } else {
            // client accessed the menu via non-client menu
            state.vars.nonClient = 'true';
            state.vars.marketInfo = JSON.stringify({nonClient: 'true'});
        }
        global.sayText(translate('market_access_menu',{}, lang));
        global.promptDigits(marketAccessHandler.handlerName);
    }
};