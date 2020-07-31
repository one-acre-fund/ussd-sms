var confirmation = require('../confirmation/confirmTesterPackReception');
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var status = require('../status/status');
var lang = state.vars.lang;
var getMessage = translator(translations, lang);

module.exports = function testerPackMenuHandler(input) {
    if(input == 1) {
        status.startTesterPackStatus({lang: lang});
    } else if(input == 2) {
        confirmation.startTesterPackConfirmation({lang: lang});
    } else {
        sayText(getMessage('invalid_input', {'$Menu': getMessage('tester_pack_menu', {}, lang)}, lang));
        promptDigits('tester_pack_menu', {submitOnHash: false, maxDigits: 2, timeout: 5});
    }
};
