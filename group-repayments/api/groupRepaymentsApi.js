var groupSummaryEndpoint = '/Api/GroupSummary/Get?';

/**
 * Performs the api call to roster api and returns the group information
 * @param {Number} DistrictId the id of the district
 * @param {Number} GroupId the id of the group that the user is a GL for
 */

module.exports = function fetchGroupRepaymentInfo(DistrictId, GroupId) {
    var fullUrl = service.vars.server_name + groupSummaryEndpoint + 'DistrictId=' + DistrictId + '&GroupId=' + GroupId;
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
            console.log('####Failed to fetch group summary bundles');
            console.log(JSON.stringify(response));
        }
    } catch (error) {
        console.log('Error: ' + error);
    }
};