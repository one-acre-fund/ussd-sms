
var getTransactionHistory= require('../get-transaction-history');
var roster = require('../../rw-legacy/lib/roster/api');

var getTranslator = require('../../utils/translator/translator');
var translations = require('../translations');

var handlerName = 'on-last-four-id-input-handler-handler';
module.exports = {
    handlerName: handlerName,
    getHandler: function (account,country, onIdValidated) {
        return function (input) {
            var lang = state.vars.lang || project.vars.lang;
            var translate = getTranslator(translations, lang);
            var client = roster.getClient(account, country);
        
            if(client.NationalId.slice(-4) !== input){
                sayText(translate('invalid_last_4_nid_digits'));
                promptDigits(handlerName);
                return;        
            }
            var transactions = getTransactionHistory();
            var txOptions = '';
            transactions.forEach(function ( tx, index) {
                txOptions = txOptions+'\n'+ translate('payment_details',
                    {'$option': index+1, '$date': tx.date, '$amount': tx.amount });
            });
        
            sayText(
                translate('select_payment_detail_prompt') + txOptions
            );
            onIdValidated(client);
        };
    }
};