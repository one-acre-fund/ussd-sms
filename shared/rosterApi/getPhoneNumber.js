var Log = require('../../logger/elk/elk-logger');

/**
 * Returns the phone number
 * @param {String} globalClientId global client id
 */
module.exports = function getPhoneNumber(account_number, country) {
    var logger = new Log();
    var fullUrl = service.vars.server_name + '/Api/sms/PhoneNumbers/?account=' + account_number + '&country=' + country;
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
            console.log('Error while fetching client phone number');
            console.log(JSON.stringify(response));
            logger.error('Error while fetching client phone number', {data: JSON.stringify(response)});
        }
    } catch (error) {
        logger.error('API Error while fetching client phone number', {data: JSON.stringify(error)});
    }
};
