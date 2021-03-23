var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var phoneHandler = require('./inputHandlers/phoneNumberHandler');

function start(lang, trainingsHandler) {
    state.vars.trainingsHandler = trainingsHandler; 
    var getMessage = translator(translations, lang);
    global.sayText(getMessage('enter_phone', {}, lang));
    global.promptDigits(phoneHandler.handlerName);
}

function registerInputHandlers(trainingMenuText, lang) {
    global.addInputHandler(phoneHandler.handlerName, phoneHandler.getHandler(trainingMenuText, lang));
}

module.exports = {
    start: start,
    registerInputHandlers: registerInputHandlers
};
