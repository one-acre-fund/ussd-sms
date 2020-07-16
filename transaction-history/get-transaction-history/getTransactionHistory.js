var slack = require('../../slack-logger/index');

module.exports = function (client) {
    var getRepaymentsEndpoint = '/Api/ClientRepayment/Get/?ClientId='+client.ClientId+'&DistrictId='+client.DistrictId;
    var fullUrl = service.vars.server_name + getRepaymentsEndpoint;
    var opts = { headers: {} };
    opts.headers['Authorization'] = 'Token ' + service.vars.roster_api_key;
    opts.method = 'GET';

    try {
        var response = httpClient.request(fullUrl, opts);
        if (response.status == 200) {
            var data = JSON.parse(response.content);
            return data;
        }
        else {
            slack.log('Failed to fetch client transactions: \n'+ JSON.stringify(response));
        }
    } catch (error) {
        slack.log('Error fetching client transactions: ' + error);
    }
    return [];
};