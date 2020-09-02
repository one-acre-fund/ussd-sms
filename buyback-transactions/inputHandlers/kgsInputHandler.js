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
            var currentSeason = JSON.parse(state.vars.current_season);
            var clientName = state.vars.client_name;
            var outStandingCredit = currentSeason.Balance;
            var payoutAmount = outStandingCredit - kgs * selected_variety.price;
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
