var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

module.exports = function(TraineeName, lang) {
    var getMessage = translator(translations, lang);
    global.sayText(getMessage('trainings_welcome_message', {'$name': TraineeName}, lang));
};
