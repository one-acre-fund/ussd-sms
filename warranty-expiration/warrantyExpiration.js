var translations = require('./translations');
var translator = require('../utils/translator/translator');
var getProductExpirationInfo = require('../shared/rosterApi/getProductExpirationInfo');
var serialNumberHandler = require('./serial-number-handler/serialNumberHandler');
var notifyELK = require('../notifications/elk-notification/elkNotification');

module.exports = {
    registerHandlers: function () {
        function onSerialNumberReceived(serialNumber) {
            var clientID = state.vars.clientID;
            var expiryInfo = getProductExpirationInfo(clientID, serialNumber);

            var getMessage = translator(translations, state.vars.exp_lang);
            var message = expiryInfo
                ? getMessage('warranty_message', {'$date': expiryInfo.date})
                : getMessage('not_registered_serial_number');

            global.sayText(message);
            global.stopRules();
        }

        addInputHandler(serialNumberHandler.handlerName, serialNumberHandler.getHandler(onSerialNumberReceived));
    },
    start: function (clientID, lang) {
        notifyELK();
        state.vars.clientID = clientID;
        state.vars.exp_lang = lang;
        var getMessage = translator(translations, lang);
        var message = getMessage('serial_number_prompt');
        global.sayText(message);
        global.promptDigits(serialNumberHandler.handlerName);
    }

};
