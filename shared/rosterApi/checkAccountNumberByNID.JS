var Log = require('../../logger/elk/elk-logger');
var accountNumberEndpoint = '/api/sms/client?';

/**
 * Returns the client information
 * @param {String} nationalId the client's nationa id
 * @param {String} countryId the client's origin country's id
 * @returns {Object} client's object
 */
module.exports = function checkAccountNumberByNid(nationalId, countryId) {
    var logger = new Log();
    var fullUrl = service.vars.server_name + accountNumberEndpoint + 'nationalId=' + nationalId + '&countryCode=' + countryId;
    var opts = { headers: {} };
    opts.headers['Authorization'] = 'Token ' + service.vars.roster_read_key;
    opts.headers['Content-Type'] = 'application/json';
    opts.method = 'GET';
    try {
        var response = httpClient.request(fullUrl, opts);
        if (response.status == 200) {
            var data = JSON.parse(response.content);
            return data;
        }
        else {
            console.log('Error while fetching client account');
            console.log(JSON.stringify(response));
            logger.error('Error while fetching client acccount', {data: JSON.stringify(response)});
        }
    } catch (error) {
        logger.error('API Error while fetching client account', {data: JSON.stringify(error)});
    }
};
