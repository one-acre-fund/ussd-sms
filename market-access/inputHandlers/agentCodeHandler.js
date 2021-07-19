var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var handlerName = 'mktaccess_agent_code';

module.exports = {
    handlerName: handlerName,
    getHandler: function(onMarketAccessOptionChosen) {
        return function(input) {
            var lang = state.vars.marketLang;
            //store agent code in the service or project variables
            var agentCode = project.vars.mkt_access_agentCode || service.vars.mkt_access_agentCode;
            if(input == agentCode) {
                // code matches. call onMarketAccessOptionChosen with option 3
                onMarketAccessOptionChosen(3);
            } else {
                // code does not match. reprompt for agent code
                global.sayText(translate('agent_code', {}, lang));
                global.promptDigits(handlerName);
                return;
            }
        };
    }
};
