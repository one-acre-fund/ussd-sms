var handlerName = 'mkt_access_menu_handler';
var agentCodeHandler = require('./agentCodeHandler');
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
module.exports = {
    handlerName: handlerName,
    getHandler: function(onMarketAccessOptionChosen){
        return function(input) {
            var lang = state.vars.marketLang;
            if(input == 0) {
                // client want to go back to the main menu
                global.sayText(translate('account_number_prompt', {}, lang));
                global.promptDigits('account_number_splash');
                return;
            } else if(input == 3) {
                // client must provide a valid agent code
                global.sayText(translate('agent_code', {}, lang));
                global.promptDigits(agentCodeHandler.handlerName);
                return;
            }
            return onMarketAccessOptionChosen(input);
        };
    }
};