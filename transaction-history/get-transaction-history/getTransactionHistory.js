var Log = require('../../logger/elk/elk-logger');

module.exports = function (client) {
    var getRepaymentsEndpoint = '/Api/ClientRepayment/Get/?ClientId='+client.ClientId+'&DistrictId='+client.DistrictId;
    var fullUrl = service.vars.server_name + getRepaymentsEndpoint;
    var opts = { headers: {} };
    opts.headers['Authorization'] = 'Token ' + service.vars.roster_api_key;
    opts.method = 'GET';

    try {
        var logger;
        var response = httpClient.request(fullUrl, opts);
        if (response.status == 200) {
            var data = JSON.parse(response.content);
            return data;
        }
        else {
            logger = new Log();
            logger.error('Failed to fetch client transactions', {data: response});
        }
    } catch (error) {
        logger = new Log();
        logger.error('Error fetching client transactions', {data: error});
    }
    return [];
};