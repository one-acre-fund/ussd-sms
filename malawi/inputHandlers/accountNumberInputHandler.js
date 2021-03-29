var getClient = require('../utils/getClient');
var onAccountNumberValidated = require('../utils/onAccountNumberValidated');
var accountNumberInputHandler = 'mw_account_number_handler';

module.exports = {
    handlerName: accountNumberInputHandler,
    getHandler: function(lang) {
        return function(input){
            var account_number = input.replace(/\D/g, '');

            var client = getClient(account_number);
            if(client.error_message){
                sayText(client.error_message);
                promptDigits('account_number', {
                    'submitOnHash': false,
                    'maxDigits': 8,
                    'timeout': 10,
                });
            } else {
                onAccountNumberValidated(lang, client);
            } 
        };
    }
};
