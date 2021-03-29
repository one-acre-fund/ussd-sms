var handlerName = 'mw_next_balance_handler';
var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var choice = input && input.trim();
            var getMessage = translator(translations, lang);
            var balanceScreens = JSON.parse(state.vars.balance_screens);
            var currentSeasonBalance = parseInt(state.vars.current_season_balance);
            var balanceMenu = getMessage('balance_menu', {}, lang);
            if(choice == '1' && (Object.keys(balanceScreens).length !== currentSeasonBalance)) {
                // next season
                state.vars.current_season_balance = currentSeasonBalance + 1;
                global.sayText(balanceScreens[state.vars.current_season_balance] + balanceMenu);
                global.promptDigits(handlerName);
            } else if(choice == '2') {
                // send message
                global.sendMessage({
                    'content': balanceScreens[currentSeasonBalance],
                    'to_number': contact.phone_number
                });
                global.stopRules();
            } else {
                // reprompt
                global.sayText(balanceScreens[currentSeasonBalance] + balanceMenu);
                global.promptDigits(handlerName);
            }
        };
    }
};
