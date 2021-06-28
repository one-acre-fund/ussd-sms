var translator = require('../utils/translator/translator');
var translations = require('./translations/index');
var registerInputHandlers = require('./inputHandlers/registerInputHandlers');
var customSeedVarietyInputHandler = require('./inputHandlers/customSeedVarietyInputHandler');
/**
 * Starts the seed germination issues  
 * @param {String} lang language used for the service
 */
function seedGerminationIssues(lang) {
    var getMessage = translator(translations, lang);
    global.sayText(getMessage('custom_seed_variety', {}, lang));
    global.promptDigits(customSeedVarietyInputHandler.handlerName);
}

module.exports = {
    registerInputHandlers: registerInputHandlers,
    start: seedGerminationIssues,
};
