var translations = require('./translations/index');
var translator = require('../../utils/translator/translator');

/**
 * Spins the tester pack registration
 */
function startTesterPackRegistration() {
    var lang = state.vars.lang;
    var getMessage = translator(translations, lang);
    state.vars.survey_type = 'ext';
    sayText(getMessage('fp_enter_id', {}, lang));
    promptDigits('fp_enter_id', {'submitOnHash': false,
        'maxDigits': 8,
        'timeout': 180
    });
}

module.exports = {
    startTesterPackRegistration: startTesterPackRegistration
};
