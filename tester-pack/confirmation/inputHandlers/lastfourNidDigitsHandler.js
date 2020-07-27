var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');

module.exports = function farmerHandler(input) {
    var lang = state.vars.lang || 'en';
    state.vars.lang = lang;
    var getMessage = translator(translations, lang);
    var farmer = JSON.parse(state.vars.selected_farmer);
    var nid = farmer.national_id;
    var last_four_nid_digits = nid.slice(-4);
    
    if(input === last_four_nid_digits) {
        sayText(getMessage('confirm_reception'));
        promptDigits('confirm_reception', {
            timeout: 5,
            maxDigits: 2,
            submitOnHash: false
        });
    } else {
        sayText(getMessage('incorrect_id_try_again', {}, lang));
        promptDigits('last_four_nid_digits', {
            timeout: 10,
            maxDigits: 4,
            submitOnHash: false
        });
    }
};
