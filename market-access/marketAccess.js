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
var notifyELK = require('../notifications/elk-notification/elkNotification');
var marketInfo ={};


function onQuantitySubmitted(quantity){
    marketInfo.quantity = quantity;
    global.sayText(translate('maize_availability',{},state.vars.marketLang));
    global.promptDigits(dateAvailableHandler.handlerName);
}
function onDateSubmitted(date){
    marketInfo.date = date;
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
        marketInfo.paymentAdvanceChoice = 'True';
        global.sayText(translate('payment_choice',{},state.vars.marketLang));
        global.promptDigits(paymentChoiceHandler.handlerName);
    }
}
function onPaymentChoice(paymentChoice){
    if(paymentChoice == 1 ){
        marketInfo.paymentAdvanceChoice = 'MOMO';
        global.sayText(translate('MOMO_choice',{},state.vars.marketLang));
        global.promptDigits(MOMOHandler.handlerName);

    }else if(paymentChoice == 2){
        marketInfo.paymentAdvanceChoice = 'Bank';
        global.sayText(translate('bank_name_menu',{},state.vars.marketLang));

    }else if(paymentChoice == 3){
        global.sayText(translate('payment_advance',{},state.vars.marketLang));
        global.promptDigits(paymentAdvanceHandler.handlerName);
    }
}
function onMOMOChosen(input){
    if(input == 1){
        marketInfo.MOMOChoice = 'MTN';
        global.sayText(translate('phone_number_menu',{},state.vars.marketLang));
        global.promptDigits(phoneNumberHandler.handlerName);
    }else if(input == 2){
        marketInfo.MOMOChoice = 'Airtel';
        global.sayText(translate('phone_number_menu',{},state.vars.marketLang));
        global.promptDigits(phoneNumberHandler.handlerName);
    }
}
function onPhoneSubmitted(phoneNumber){
    marketInfo.phoneNumber = phoneNumber;
    global.sayText(translate('farmer_name_menu',{},state.vars.marketLang));
    global.promptDigits(nameHandler.handlerName);
}
function onNameSubmitted(name){
    marketInfo.name = name;
    global.sayText(translate('final_message_momo',{},state.vars.marketLang));
    global.promptDigits(nameHandler.handlerName);

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
    },
    start: function (account, country, lang) {
        notifyELK();
        state.vars.account = account;
        state.vars.country = country;
        state.vars.marketLang = lang;
        var translate =  createTranslator(translations, state.vars.marketLang);
        global.sayText(translate('quantity_unshield_maize',{}));
        global.promptDigits(quantityHandler.handlerName);
    
    }  
};