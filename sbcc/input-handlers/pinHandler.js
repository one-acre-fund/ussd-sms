var translations = require('../translations/message-translations');
var translator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

module.exports = function nationalIdHandler(input) {
    notifyELK();
    var sbcc_variables = state.vars.sbcc_variables;
    var lang = sbcc_variables.lang;
    var getMessage = translator(translations, lang);
    console.log(input);
};