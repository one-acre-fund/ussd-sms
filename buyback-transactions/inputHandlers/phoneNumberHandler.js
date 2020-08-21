var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

module.exports = function(input) {
    var lang = state.vars.lang;
    var getMessage = translator(translations, lang);
    var phoneValid = input.match(/^(088|099)\d{7}$/);
    if(phoneValid){
        // var phone = phoneValid[0];
        var message = getMessage('transaction_data_recorded', {}, lang);
        sayText(message);
        stopRules();
    } else {
        sayText(getMessage('invalid_phone', {}, lang));
        promptDigits('mw_bb_phone', {
            submitOnHash: false,
            timeout: 5,
            maxDigits: 10
        });
    }
};
