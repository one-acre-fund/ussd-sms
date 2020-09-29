var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var triggerService = require('../shared/triggerService');
/**
 * triggers the messaging service for maize recommendation
 * @param {String} lang language to be used
 * @param {String} serviceId the service to be triggered
 */
module.exports = function(lang, serviceId) {
    var getMessage = translator(translations, lang);
    var message = getMessage('message_notification', {}, lang);
    sayText(message);
    contact.vars.lang = lang;
    triggerService(serviceId, {
        context: 'contact', 
        contact_id: contact.id
    });
    stopRules();
};
