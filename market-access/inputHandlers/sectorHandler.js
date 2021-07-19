var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);

var handlerName = 'mkt_access_sector_handler';

module.exports = {
    handlerName: handlerName,
    getHandler: function() {
        return function(input) {
            var lang = state.vars.marketLang;
            var marketAccessEntrepreneurs = JSON.parse(state.vars.mkt_access_entrepreneurs);
            var matchingMarketAccessEntrepreneurs = marketAccessEntrepreneurs.filter(function(entry) {
                return (entry.sector.toLowerCase() == input && input.toLowerCase());
            });
            if(matchingMarketAccessEntrepreneurs.length > 0) {
                // there is a match
                var matchingMarketAccessEntrepreneur = matchingMarketAccessEntrepreneurs[0];
                global.sayText(translate('closest_agent_location', {
                    '$name': matchingMarketAccessEntrepreneur.name,
                    '$surname': matchingMarketAccessEntrepreneur.surname,
                    '$phone_number': matchingMarketAccessEntrepreneur.phone_number,
                }, lang));
                global.stopRules();
            } else {
                // the sector is miswritten. reprompt.
                global.sayText(translate('enter_sector', {}, lang));
                global.promptDigits(handlerName);
            }
        };
    }
};
