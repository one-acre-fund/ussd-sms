var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var nationalIdInputHandler = require('./inputHandlers/nationalIdInputHandler');

function start(lang, countryId) {
    var getMessage = translator(translations, lang);
    global.sayText(getMessage('enter_nid', {}, lang));
    global.promptDigits(nationalIdInputHandler.handlerName);
    state.vars.countryId = countryId;
}

function registerInputHandlers(lang) {
    global.addInputHandler(nationalIdInputHandler.handlerName, nationalIdInputHandler.getHandler(lang));
}

module.exports = {
    start: start,
    registerInputHandlers: registerInputHandlers
};
