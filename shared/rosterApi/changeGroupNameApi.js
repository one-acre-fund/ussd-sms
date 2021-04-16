var Log = require('../../logger/elk/elk-logger');

/**
 * Api util to change group name on roster
 * @param {Object} groupDetails object with districtId, groupId, clientId and groupName
 * @returns group details
 */
module.exports = function changeGroupName(groupDetails) {
    var logger = new Log();
    var fullUrl = service.vars.server_name + '/Api/Groups/EditGroupName';
    var opts = { headers: {} };
    opts.headers['Authorization'] = 'Token ' + service.vars.roster_api_key;
    opts.headers['Content-Type'] = 'application/json';
    opts.method = 'PATCH';
    opts.data = JSON.stringify(groupDetails);
    try {
        var response = httpClient.request(fullUrl, opts);
        if (response.status == 200) {
            var data = JSON.parse(response.content);
            return data;
        }
        else {
            logger.error('Error while changing group name', {data: JSON.stringify(response)});
            console.log('Error while changing group name' + JSON.stringify({response: response, opts: opts}));
        }
    } catch (error) {
        logger.error('API Error while changing group name', {data: JSON.stringify(error)});
        console.log('API Error while changing group name' + JSON.stringify({error: error, opts: opts}));
    }
};
