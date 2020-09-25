var slacLogger = require('../slack-logger/index');

/**
 * triggers a service by the given id  
 * @param {String} ServiceID id of the service to be triggered
 * @param {Object} options object of options about the way the service will be triggered
 */
module.exports = function (ServiceID, options){
    try{
        var service = project.initServiceById(ServiceID);
        service.invoke(options);
    }
    catch(err){
        slacLogger.log('Error triggering service: ' + ServiceID + '\n' + JSON.stringify({error: err}));
    }
};