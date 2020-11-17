var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var claimTypeInputHAndler = require('./inputHandlers/claimTypeInputHandler');

function start(lang) {
    var getMessage = translator(translations, lang);
    var claimsMenu = getMessage('claim_status_menu', {}, lang);
    global.sayText(claimsMenu);
    global.promptDigits(claimTypeInputHAndler.handlerName);
}

module.exports = {
    start: start
};
