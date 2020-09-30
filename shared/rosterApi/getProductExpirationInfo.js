var Log = require('../../logger/elk/elk-logger');

/**
 * Fetches product
 * @param {string} accountNumber client account number
 * @param {string} serialNumber product serial number
 * @returns {Object} product expiration information
 */
module.exports = function getProductExpirationInfo(clientID, serialNumber) {
    var logger = new Log();
    var fullUrl = service.vars.server_name + '/api/products/getExpirationInfo?globalClientId=' + clientID + '&serialNumber=' + serialNumber;
    var opts = { headers: {} };
    opts.headers['Authorization'] = 'ApiKey ' + service.vars.roster_read_key;
    opts.headers['Content-Type'] = 'application/json';
    opts.method = 'GET';
    try {
        var response = httpClient.request(fullUrl, opts);
        if (response.status == 200) {
            var data = JSON.parse(response.content);
            return data;
        }
        else {
            console.log('Error while getting product expiration info');
            console.log(JSON.stringify(response));
            logger.error('Error while getting product expiration info', {data: JSON.stringify(response)});
        }
    } catch (error) {
        logger.error('API Error while getting product expiration info', {data: JSON.stringify(error)});
    }
};
