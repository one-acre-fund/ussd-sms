var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

module.exports = function testerPackMenuHandler(input) {
    var lang = state.vars.lang || 'en';
    state.vars.lang = lang;
    var getMessage = translator(translations, lang);
    if(input == 2) {
        var provinces = {'1': 'EASTERN ZONE', '2': 'KIGALI CITY', '3': 'SOUTHERN ZONE', '4': 'WESRERN ZONE', '5': 'NORTHERN ZONE'};
        state.vars.provinces = JSON.stringify(provinces);
        sayText(getMessage('provinces_title', {}, lang) + getMessage('provinces', {}, lang));
        promptDigits('select_province', {
            timeout: 5,
            maxDigits: 2,
            submitOnHash: false
        });
    }
};
