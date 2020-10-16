var translations = require('./translations/index');
var translator = require('../../utils/translator/translator');
var accountNumberInputHandler = require('./inputHandlers/accountNumberInputHandler');
var confirmFirstSecondNameInputHandler = require('./inputHandlers/confirmFirstSecondNameInputHandler');
var confirmInvoiceInputHandler = require('./inputHandlers/confirmInvoiceIdInputHandler');
var confirmNidInputHandler = require('./inputHandlers/confirmNidInputHandler');
var confirmPhoneInputHandler = require('./inputHandlers/confirmPhoneNumberInputHandler');
var firstNameInputHandler = require('./inputHandlers/firstNameInputHandler');
var secondNameInputHandler = require('./inputHandlers/secondNameInputHandler');
var phoneNumberInputHandler = require('./inputHandlers/phoneNumberInputHandler');
var invoiceInputHandler = require('./inputHandlers/invoiceIdInputHandler');
var nationalIdInputHandler = require('./inputHandlers/nationalIdInputHandler');
var transactionTypeInputHandler = require('./inputHandlers/transactionTypeInputHandler');

function registerInputHandlers(lang, duka_clients_table) {
    addInputHandler(accountNumberInputHandler.handlerName, accountNumberInputHandler.getHandler(lang));
    addInputHandler(transactionTypeInputHandler.handlerName, transactionTypeInputHandler.getHandler(lang));
    addInputHandler(confirmFirstSecondNameInputHandler.handlerName, confirmFirstSecondNameInputHandler.getHandler(lang,  duka_clients_table));
    addInputHandler(confirmInvoiceInputHandler.handlerName, confirmInvoiceInputHandler.getHandler(lang,  duka_clients_table));
    addInputHandler(confirmNidInputHandler.handlerName, confirmNidInputHandler.getHandler(lang));
    addInputHandler(confirmPhoneInputHandler.handlerName, confirmPhoneInputHandler.getHandler(lang));
    addInputHandler(firstNameInputHandler.handlerName, firstNameInputHandler.getHandler(lang));
    addInputHandler(secondNameInputHandler.handlerName, secondNameInputHandler.getHandler(lang));
    addInputHandler(phoneNumberInputHandler.handlerName, phoneNumberInputHandler.getHandler(lang));
    addInputHandler(invoiceInputHandler.handlerName, invoiceInputHandler.getHandler(lang));
    addInputHandler(nationalIdInputHandler.handlerName, nationalIdInputHandler.getHandler(lang));
}

function start(lang) {
    var getMessage = translator(translations, lang);
    var accountNumberMessage = getMessage('account_number', {}, lang);
    global.sayText(accountNumberMessage);
    global.promptDigits(accountNumberInputHandler.handlerName);
}

module.exports = {
    start: start,
    registerInputHandlers: registerInputHandlers
};