var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var slacLogger = require('../slack-logger/index');

function trigger(ServiceID) {
    try{
        var service = project.initServiceById(ServiceID);
        service.invoke({
            context: 'call', 
        });
    }
    catch(err){
        slacLogger.log('Error triggering service: ' + ServiceID + JSON.stringify({error: err}));
    }
}


/**
 * triggers the messaging service for maize recommendation
 * @param {String} lang language to be used
 * @param {Function} trigger function to trigger the messaging service
 * @param {String} serviceId the service to be triggered
 */
module.exports = function(lang, serviceId) {
    var getMessage = translator(translations, lang);
    var message = getMessage('message_notification', {}, lang);
    sayText(message);
    trigger(serviceId);
    stopRules();
};
