var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var getClient = require('../../shared/rosterApi/getClient');

/**
 * Validates and fetches a client. Returns client or error message after validations
 * @param {Number} account_number user's registered account input
 */
module.exports = function(account_number){
    var lang = state.vars.lang;
    var getMessage = translator(translations, lang);
    if(account_number.length !== 8 || account_number < 0){
        var message = getMessage('invalid_account', {}, lang);
        return {error_message: message};
    } else {
        // call roster and return client if client is valid
        var client = getClient(account_number, 'malawi');
        if(client){
            return {client: client};
        } else {
            message = getMessage('account_number_not_found', {}, lang);
            return {error_message: message};
        }
    }
};