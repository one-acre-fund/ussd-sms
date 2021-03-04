var translator = require('../../utils/translator/translator');
var translations = require('./translations/index');
var nationalIdHandler = require('./inputHandlers/nationalIdInputHandler');
var registerInputHandlers = require('./inputHandlers/registerInputHandlers');

function start(language) {
    var getMessage = translator(translations, language);
    global.sayText(getMessage('national_id'));
    global.promptDigits(nationalIdHandler.handlerName);
}
module.exports = {
    start: start,
    registerInputHandlers: registerInputHandlers
};
