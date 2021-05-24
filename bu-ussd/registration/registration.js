var translator = require('../../utils/translator/translator');
var translations = require('./translations/index');
var nationalIdHandler = require('./inputHandlers/nationalIdInputHandler');
var registerInputHandlers = require('./inputHandlers/registerInputHandlers');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

function start(language) {
    notifyELK();
    var getMessage = translator(translations, language);
    global.sayText(getMessage('national_id'));
    global.promptDigits(nationalIdHandler.handlerName);
}
module.exports = {
    start: start,
    registerInputHandlers: registerInputHandlers
};
