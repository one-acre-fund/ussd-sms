var createTranslator = require('../utils/translator/translator');
var translations = require('./translations');

var shsWarranty = {
    registerHandlers: function () {
    },
    start: function (lang) {
        var translate = createTranslator(translations,lang);
        sayText(translate('Serial-Number-Prompt'));
    }
};
module.exports = shsWarranty;