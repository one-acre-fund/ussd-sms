
var Log = require('../logger/elk/elk-logger');
module.exports = function send_request(requestData) {
    var response;
    var enrollmentEndpoint = '/api/USSDEnrollment/Enrollment/';
    var fullUrl = service.vars.server_name + enrollmentEndpoint;
    console.log('####FULL-URL: ' + fullUrl);
    var opts = { headers: {} };
    opts.headers['Authorization'] = 'Token ' + service.vars.roster_api_key;
    opts.method = 'POST';
    opts.data = requestData;
    console.log('####### requestData:' + requestData);
    console.log('#### OPtions: ' + JSON.stringify(opts));

    try {
        response = httpClient.request(fullUrl, opts);
        if (response.status == 201) {
            console.log('***************ENR_SUCCESS*******************' + JSON.stringify(response));
            return true;
        }else{
            var logger = new Log();
            logger.warn('Failed to enroll ',{data: response});
            console.log('#### ENR_Failed to save' + JSON.stringify(response));
        }
    } catch (e) {
        var log = new Log();
        log.error('Failed to enroll', {data: e});
        console.log('Error' + e);
        return false;
    }    
    return false;

};
