var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

var kgsHandlerName= 'kgs';

module.exports = {
    handlerName: kgsHandlerName,
    handler: function(input) {
        var lang = state.vars.lang;
        var getMessage = translator(translations, lang);
    
        var kgs = Math.round(input);
        if(kgs > 0){
            state.vars.transaction_volume = kgs;
            var selected_variety = JSON.parse(state.vars.selected_variety);
            var client = JSON.parse(state.vars.client);
            var currentSeason = client.BalanceHistory[0];
            var clientName = client.ClientName;
            var outStandingCredit = currentSeason.balance;
            var payoutAmount = outStandingCredit - kgs * selected_variety.price_per_kg;
            var message = getMessage('payout_amount', {
                '$clientName': clientName,
                '$credit': outStandingCredit,
                '$payout': payoutAmount
            }, lang);
            sayText(message);
            promptDigits('mw_bb_phone', {
                submitOnHash: false,
                timeout: 5,
                maxDigits: 10
            });
        } else {
            sayText(getMessage('invalid_kgs', {}, lang));
            promptDigits('kgs', {
                submitOnHash: false,
                timeout: 5,
                maxDigits: 10
            });
        }
    }    
};
