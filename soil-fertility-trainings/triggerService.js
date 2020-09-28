var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var triggerService = require('../shared/triggerService');

/**
 * triggers the messaging service for soil fetility training
 * @param {String} lang language to be used
 * @param {String} serviceId the service to be triggered
 */
module.exports = function(lang, serviceId) {
    var getMessage = translator(translations, lang);
    var message = getMessage('message_notification', {}, lang);
    contact.vars.lang = lang;
    sayText(message);
    triggerService(serviceId, {
        context: 'contact', 
        contact_id: contact.id
    });
    stopRules();
};
