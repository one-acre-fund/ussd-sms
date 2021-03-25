var createMenu = require('../../shared/createMenu');
var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');
var menuOptions = require('./menuOptions');
var mainMenuHandler = require('../inputHandlers/mainMenuHandler');

module.exports = function onAccountNumberValidated(lang, client) {
    // save the accouint numner and the balance information accross the seasons
    client.BalanceHistory = client.BalanceHistory.slice(0, 5);
    state.vars.client_json = JSON.stringify(client);
    // display the menu
    var getMessage = translator(translations, lang);
    var menuDetails = createMenu(menuOptions, getMessage('next_screen', {}, lang), getMessage('select_service', {}, lang), 140);
    state.vars.mw_main_screens = JSON.stringify(menuDetails.screens);
    state.vars.mw_main_option_values = JSON.stringify(menuDetails.optionValues);
    state.vars.current_mw_main_screen = '1';
    global.sayText(menuDetails.screens[state.vars.current_mw_main_screen]);
    global.promptDigits(mainMenuHandler.handlerName);
};
