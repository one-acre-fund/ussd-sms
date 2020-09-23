var createTranslator = require('../utils/translator/translator');
var SerialNumberHandler = require('./input-handlers/serial-number');
var translations = require('./translations');

var shsWarranty = {
    registerHandlers: function (server_name) {
        addInputHandler(SerialNumberHandler.name, SerialNumberHandler.getHandler(server_name));
    },
    start: function (lang, GlobalClientId) {
        global.state.vars.GlobalClientId = GlobalClientId;
        var translate = createTranslator(translations,lang);
        sayText(translate('Serial-Number-Prompt'));
        promptDigits(SerialNumberHandler.name);
    }
};
module.exports = shsWarranty;