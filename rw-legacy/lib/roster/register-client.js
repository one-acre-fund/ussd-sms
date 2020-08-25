
var logResponse = require('../utils/request-logger');
var registrationEndpoint = '/Api/Registrations/RegisterClient';
var slack = require('../../../slack-logger/index');
var Log = require('../../../logger/elk/elk-logger');


/**
 * 
 * @param {Object} clientJSON 
 * @param {number} districtId
 * @param {number} siteId
 * @param {number} groupId
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} nationalIdNumber
 * @param {string} phoneNumber
 * @param {string} lang 
 */

module.exports = function (clientJSON, lang) {

    var logger;
    var response;
    var fullUrl = service.vars.server_name + registrationEndpoint;
    var opts = { headers: {} };
    opts.headers['Authorization'] = 'Token ' + service.vars.roster_api_key;
    opts.method = 'POST';
    opts.data = clientJSON;

    try {
        logger = new Log(project.vars.elk_logs_base_url);
    } catch (error) {
        slack.log('Error creating logger'+ error);
    }
    
    try {
        response = httpClient.request(fullUrl, opts);
        var msgs = require('../msg-retrieve');
        if (response.status == 200) {
            return response.content;
        }
        else if (response.status == 409) {
            logResponse(fullUrl, response);
            if (response.content == '"National Id Conflict"') {
                sayText(msgs('ENR_NATIONAL_ID_DUPLICATE'), {}, lang);
                stopRules();
                return null;
            }
        }
        else {
            logResponse(fullUrl, response);
            sayText(msgs('FAILURE_REGISTERING'), {}, lang);
            if(logger) logger.warn('Error Registering a new Client',{tags: [service.vars.env],data: response});
            stopRules();
            return null;
        }
    } catch (e) {
        if(logger) logger.error('Error Registering a new Client',{tags: [service.vars.env],data: {error: e,response: response}});
    }

};