var slackLogger = require('../../slack-logger/index');

var groupLeaderEndpoint = '/Api/GroupSummary/CheckGroupLeader?';

/**
 * Performs the api call to roster api and returns whether a user is a group leader
 * @param {Number} DistrictId the id of the district
 * @param {Number} ClientId the id of the client that must be a gl
 */

module.exports = function checkForGl(DistrictId, ClientId) {
    var fullUrl = service.vars.server_name + groupLeaderEndpoint + 'DistrictId=' + DistrictId + '&ClientId=' + ClientId;
    var opts = { headers: {} };
    opts.headers['Authorization'] = 'Token ' + service.vars.roster_api_key;
    opts.method = 'GET';
    try {
        var response = httpClient.request(fullUrl, opts);
        if (response.status == 200) {
            var data = JSON.parse(response.content);
            return data.isGroupLeader;
        }
        else {
            console.log('#### error while checking for a gl');
            console.log(JSON.stringify(response));
        }
    } catch (error) {
        slackLogger.log(error);
    }
};
