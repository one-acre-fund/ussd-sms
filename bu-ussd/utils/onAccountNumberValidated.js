var populateMenu = require('../../shared/createMenu');
var menuOptions = require('./menuOptions');
var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');
var checkGroupLeader = require('../../shared/rosterApi/checkForGroupLeader');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var reduceClientSize = require('../../shared/reduceClientSize');

module.exports = function onAccountNumberValidated(lang, client) {
    notifyELK();
    var mainMenuHandler = require('../inputHandlers/mainMenuHandler');
    state.vars.client_json = JSON.stringify(reduceClientSize(client));
    var isGroupLeader = checkGroupLeader(client && client.DistrictId, client && client.ClientId);
    state.vars.isGroupLeader = isGroupLeader;
    var getMessage = translator(translations, lang);
    var filteredOptions = getOptions(menuOptions);
    var optionNames = {};
    filteredOptions.forEach(function(option) {
        var key = Object.keys(option)[0];
        optionNames[key] = option[key][lang];
    });
    var title = getMessage('main_menu_title', {}, lang);
    var resultOptions = populateMenu(optionNames, '', title);
    var screens = resultOptions.screens;
    var optionValues = resultOptions.optionValues;
    state.vars.main_screens = JSON.stringify(screens);
    state.vars.current_main_screen = '1';
    state.vars.main_option_values = JSON.stringify(optionValues);
    global.sayText(screens[1]);
    global.promptDigits(mainMenuHandler.handlerName);
};

function getOptions(options) {
    var filteredOptions = options.filter(function(option) {
        var includeOption = true;
        if((Object.keys(option)[0] === 'registration' || Object.keys(option)[0] === 'place_order')  && !state.vars.isGroupLeader) {
            // skip registration and enrollment/ordering since the user is not a group leader
            includeOption = false;
        }
        return includeOption;
    });
    return filteredOptions;
}