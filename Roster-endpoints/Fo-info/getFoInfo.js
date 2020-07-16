
const logResponse = require('../../rw-legacy/lib/utils/request-logger')
var FOInfoEndpoint = "Api/FieldOfficer/Get";

module.exports = function (districtId,siteId, lang) {

    var response;
    var requestBody = {'districtId': districtId, 'siteId': siteId}
    var fullUrl = service.vars.server_name + FOInfoEndpoint;
    console.log("####FULL-URL: " + fullUrl);
    var opts = { headers: {} };
    opts.headers['Authorization'] = "Token " + service.vars.roster_api_key;
    opts.method = "GET";
    opts.data = requestBody;
    try {
        response = httpClient.request(fullUrl, opts);
        if (response.status == 200) {
            console.log('***************SUCCESS*******************' + JSON.stringify(response));
            return response.content;
        }
        else if (response.status == 409) {
            logResponse(fullUrl, response);
            if (response.content == "\"National Id Conflict\"") {
                //var msgs = require('../msg-retrieve');
                //sayText(msgs('ENR_NATIONAL_ID_DUPLICATE'), {}, lang);
                console.log('national Id confict')
                stopRules();
                return null;
            }
        }
        else {
            //logResponse(fullUrl, response);
            //var msgs = require('../msg-retrieve');
            //sayText(msgs('FAILURE_REGISTERING'), {}, lang);
            console.log('failure registering')
            stopRules();
            return null;
        }
    } catch (e) {
        console.log('Error' + e);
    }

    console.log("####Failed to save" + JSON.stringify(response));



};