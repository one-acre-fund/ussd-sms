var createTranslator = require('../utils/translator/translator');
var SerialNumberHandler = require('./input-handlers/serial-number');
var translations = require('./translations');

var shsWarranty = {
    registerHandlers: function () {
        addInputHandler(SerialNumberHandler.name, SerialNumberHandler.getHandler());
    },
    start: function (lang, GlobalClientId) {
        global.state.vars.GlobalClientId = GlobalClientId;
        var translate = createTranslator(translations,lang);
        sayText(translate('Serial-Number-Prompt'));
        promptDigits(SerialNumberHandler.name);
    }
};
module.exports = shsWarranty;