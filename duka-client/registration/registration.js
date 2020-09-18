var translations = require('./translations/index');
var translator = require('../../utils/translator/translator');
var accountNumberInputHandler = require('./inputHandlers/accountNumberInputHandler');

function registerInputHandlers(lang,  credit_officers_table) {
    addInputHandler(accountNumberInputHandler.handlerName, accountNumberInputHandler.getHandler(lang,  credit_officers_table));
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