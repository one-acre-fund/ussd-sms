var getClient = require('../utils/getClient');
var onAccountNumberValidated = require('../utils/onAccountNumberValidated');
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var accountNumberInputHandler = 'mw_account_number_handler';

module.exports = {
    handlerName: accountNumberInputHandler,
    getHandler: function(lang) {
        return function(input){
            var account_number = input.replace(/\D/g, '');
            var getMessage = translator(translations, lang);
            var client = getClient(account_number);
            if(client.error_message){
                global.sayText(getMessage('invalid_account', {}, lang));
                global.promptDigits('account_number');
            } else {
                onAccountNumberValidated(lang, client);
            } 
        };
    }
};
