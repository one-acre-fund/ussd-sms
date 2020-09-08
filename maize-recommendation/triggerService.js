var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var slacLogger = require('../slack-logger/index');

function trigger(ServiceID) {
    console.log('reaching 1' + ServiceID);
    try{
        console.log('reaching 2' + ServiceID);
        var service = project.initServiceById(ServiceID);
        service.invoke({
            context: 'call', 
        });
        console.log('reaching 3' + ServiceID);
    }
    catch(err){
        console.log('reaching 3' + ServiceID + JSON.stringify({error: err}));
        slacLogger.log('Error triggering service: ' + ServiceID + JSON.stringify({error: err}));
    }
}


/**
 * triggers the messaging service for maize recommendation
 * @param {String} lang language to be used
 * @param {String} serviceId the service to be triggered
 */
module.exports = function(lang, serviceId) {
    var getMessage = translator(translations, lang);
    var message = getMessage('message_notification', {}, lang);
    sayText(message);
    trigger(serviceId);
    stopRules();
};
