var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var phoneHandler = require('./inputHandlers/phoneNumberHandler');

function start(lang, trainingsHandler, mainMenu, mainMenuHandlerName) {
    trainingsHandler = state.vars.trainingsHandler = trainingsHandler; 
    state.vars.trainingsHandler = mainMenu;
    state.vars.trainingsHandler = mainMenuHandlerName; 
    var getMessage = translator(translations, lang);
    global.sayText(getMessage('enter_phone', {}, lang));
    global.promptDigits(phoneHandler.handlerName);
}

function registerInputHandlers(trainingMenuText) {
    global.addInputHandler(phoneHandler.handlerName, phoneHandler.getHandler(trainingMenuText));
}

module.exports = {
    start: start,
    registerInputHandlers: registerInputHandlers
};
