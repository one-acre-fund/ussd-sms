var translations = require('./translations');
var createTranslator = require('../utils/translator/translator');
var quantityHandler = require('./quantity-handler/quantityHandler');
var dateAvailableHandler = require('./date-available-handler/dateAvailableHandler');
var notifyELK = require('../notifications/elk-notification/elkNotification');
var marketInfo ={};


function onQuantitySubmitted(quantity){
    marketInfo.quantity = quantity;
    var translate =  createTranslator(translations, state.vars.marketLang);
    global.sayText(translate('maize_availability',{}));
    global.promptDigits(dateAvailableHandler.handlerName);

}
function onDateSubmitted(date){
    marketInfo.date = date;
    var translate =  createTranslator(translations, state.vars.marketLang);
    global.sayText(translate('payment_advance',{}));
}
module.exports = {
    registerHandlers: function(){
        addInputHandler(quantityHandler.handlerName, quantityHandler.getHandler(onQuantitySubmitted));
        addInputHandler(dateAvailableHandler.handlerName, dateAvailableHandler.getHandler(onDateSubmitted));
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