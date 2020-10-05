var translations = require('../translations');
var translator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

var handlerName = 'serial_number_handler';

module.exports = {
    handlerName: handlerName,

    getHandler: function (onSerialNumberReceived) {
        return function (input) {
            notifyELK();
            var getMessage = translator(translations, state.vars.exp_lang);
            var serialNumber = input.replace(/\D/g, '');
            if (serialNumber) {
                onSerialNumberReceived(input);
            } else {
                var message = getMessage('serial_number_prompt');
                global.sayText(message);
                global.promptDigits(handlerName);
            }
        };
    }
};
