var handlerName = 'mw_main_menu_handler_name';
var buybackTransactions = require('../../buyback-transactions/buyBackTransactions');
var checkBalance = require('../checkBalance/checkBalance');

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var choice = input && input.trim();
            var mainScreens = JSON.parse(state.vars.mw_main_screens);
            var optionValues = JSON.parse(state.vars.mw_main_option_values);
            var currentScreen = state.vars.current_mw_main_screen;
            if(optionValues[choice] === 'buy_back') {
                var client = JSON.parse(state.vars.client_json);
                buybackTransactions.start(client);
            } else if(optionValues[choice] === 'check_balance') {
                checkBalance.start(lang, client);
            } else if(choice == '77') {
                mainScreens = parseInt(mainScreens) + 1;
                state.vars.current_mw_main_screen = mainScreens;
                global.sayText(mainScreens[currentScreen]);
                global.promptDigits(handlerName);
            } else {
                global.sayText(mainScreens[currentScreen]);
                global.promptDigits(handlerName);
            }
        };
    }
};
