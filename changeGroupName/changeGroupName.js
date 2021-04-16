var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var groupNameHandler = require('./inputHandlers/groupNameHandler');
var registerInputHandlers = require('./inputHandlers/registerInputHandlers');

function start(lang, client) {
    var getMessage = translator(translations, lang);
    state.vars.client_changing_group = client;
    global.sayText(getMessage('enter_group_name', {}, lang));
    global.promptDigits(groupNameHandler.handlerName);
}

module.exports = {
    start: start,
    registerInputHandlers: registerInputHandlers
};
