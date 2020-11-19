

var createMenu = require('../shared/createMenu');
var options = require('./menuOptions');
var contactCallCenterInputHandler = require('./inputHandlers/contactCallCenterInputHandler');

var nextScreenOption = {
    'en-ke': '77) Continue',
    'sw': '77) Endelea'
};

function registerInputHandlers(lang) {
    addInputHandler(contactCallCenterInputHandler.handlerName, contactCallCenterInputHandler.getHandler(lang));
}

function start(lang, isClient) {
    var menuOptions = isClient ? options.clientOptions : options.nonClientOptions;
    var menu = createMenu(menuOptions[lang], nextScreenOption[lang], '');
    state.vars.ccc_screens = menu.screens;
    state.vars.ccc_options = menu.optionValues;
    state.vars.ccc_current_screen = 1;
    global.sayText(state.vars.ccc_screens[state.vars.ccc_current_screen]);
    global.promptDigits(contactCallCenterInputHandler.handlerName);
}

module.exports = {
    start: start,
    registerInputHandlers: registerInputHandlers
};
