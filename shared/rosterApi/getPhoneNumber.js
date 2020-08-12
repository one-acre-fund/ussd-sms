var logger = require('../../slack-logger/index');

/**
 * Returns the phone number
 * @param {String} globalClientId global client id
 */
module.exports = function getPhoneNumber(account_number, country) {
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
            logger.log('Error while fetching client phone number' + JSON.stringify(response));
        }
    } catch (error) {
        logger.log('Error: ' + JSON.stringify(error));
    }
};
