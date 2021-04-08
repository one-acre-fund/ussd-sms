var getAccountNumber = require('../../shared/rosterApi/FetchClientByNid');
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

var handlerName = 'forgot_nid_handler_name';
module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var getMessage = translator(translations, lang);
            var countryId = state.vars.countryId;
            var nationalId = input && input.replace(/\D/g, '');
            var client = getAccountNumber(nationalId, countryId);
            if(client) {
                global.sayText(getMessage('display_account', {
                    '$AccountNumber': client.AccountNumber,
                    '$FirstName': client.FirstName,
                    '$LastName': client.LastName
                }, lang));
                global.stopRules();
            } else {
                global.sayText(getMessage('enter_nid', {}, lang));
                global.promptDigits(handlerName);
            }
        };
    }
};
