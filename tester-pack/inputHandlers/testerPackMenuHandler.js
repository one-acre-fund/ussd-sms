var confirmation = require('../confirmation/confirmTesterPackReception');

module.exports = function testerPackMenuHandler(input) {
    var lang = state.vars.lang || 'en';
    state.vars.lang = lang;
    if(input == 2) {
        confirmation.startTesterPackConfirmation({lang: lang});
    }
};
