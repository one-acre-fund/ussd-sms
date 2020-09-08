var translations = require('./translations/index');
var translator = require('../utils/translator/translator');

/**
 * triggers the messaging service for soil fetility training
 * @param {String} lang language to be used
 * @param {Function} trigger function to trigger the messaging service
 * @param {String} serviceId the service to be triggered
 */
module.exports = function(lang, trigger, serviceId) {
    var getMessage = translator(translations, lang);
    var message = getMessage('message_notification', {}, lang);
    sayText(message);
    trigger(serviceId);
    stopRules();
};
