
var Log = require('../../logger/elk/elk-logger');
module.exports = function (districtId,siteId) {

    var response;
    var getFOEndpoint = '/Api/FieldOfficer/Get/?districtId='+districtId+'&siteId='+siteId;
    var fullUrl = service.vars.server_name + getFOEndpoint;
    var opts = { headers: {} };
    opts.headers['Authorization'] = 'Token ' + service.vars.roster_api_key;
    opts.method = 'GET';
    try {
        response = httpClient.request(fullUrl, opts);
        if (response.status == 200) {
            console.log('success!!!!!!!!!'+ JSON.stringify(response.content));
            return response.content;
        }
        else {
            console.log('failed!!!!!!!!!'+ JSON.stringify(response.content));
            var logger = new Log();
            logger.warn('Failed to get Fo info',{data: response});
            stopRules();
            return null;
        }
    } catch (e) {
        console.log('nope!!!!!!!!!'+e);
        var log = new Log();
        log.error('Failed to get Fo info', {data: e});
    }  
};