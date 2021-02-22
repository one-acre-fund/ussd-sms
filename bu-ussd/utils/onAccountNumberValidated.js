var populateMenu = require('../../shared/createMenu');
var menuOptions = require('./menuOptions');
var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');

function reduceClientSize(client) {
    var cloned = _.clone(client);
    cloned.AccountHistory = client.AccountHistory.slice(0,3);
    cloned.BalanceHistory = client.BalanceHistory.slice(0,3);
    return cloned;
}

module.exports = function onAccountNumberValidated(lang, client) {
    state.vars.client_json = reduceClientSize(client);
    var getMessage = translator(translations, lang);
    var optionNames = {};
    menuOptions.forEach(function(option) {
        var key = Object.keys(option)[0];
        optionNames[key] = option[key][lang];
    });
    var title = getMessage('main_menu_title', {}, lang);
    var resultOptions = populateMenu(optionNames, '', title);
    var screens = resultOptions.screens;
    var optionValues = resultOptions.optionValues;
    state.main_screens = JSON.stringify(screens);
    state.vars.current_main_screen = '1';
    state.vars.main_option_values = JSON.stringify(optionValues);
    global.sayText(screens[1]);
    global.promptDigits('main_menu_handler');
};
