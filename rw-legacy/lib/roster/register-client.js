
const logResponse = require('../utils/request-logger');
var registrationEndpoint = "/Api/Registrations/RegisterClient";
const slack = require('../../../slack-logger/index');
var exampleRequestData = {
    "districtId": 1404,
    "siteId": 14,
    "groupId": 14,
    "firstName": "Angello",
    "lastName": "Obel",
    "nationalIdNumber": "{{$randomInt}}",
    "phoneNumber": "0776320345"
}

var exampleResponse = {
    "EntityType": "Client",
    "DistrictId": 1404,
    "ClientId": -1014000370,
    "FirstName": "Angello",
    "LastName": "Obel",
    "EnrollmentDate": "2020-04-29T13:29:52.36",
    "Ban": false,
    "BannedDate": null,
    "DateCreated": "2020-04-29T13:29:52.36",
    "Deceased": false,
    "DeceasedDate": null,
    "AccountNumber": "27509737",
    "GlobalClientId": "dd65a009-8bcf-475e-86b4-bc5ea5dc7939",
    "FirstSeasonId": 280,
    "LastActiveSeasonId": null,
    "NationalId": "358",
    "OldGlobalClientId": null,
    "ParentGlobalClientId": null,
    "ValidationCode": null,
    "CanEnrollAsNewMember": null,
    "SiteId": 14
}



module.exports = function (clientJSON, lang) {

    var response;
    var fullUrl = service.vars.server_name + registrationEndpoint;
    console.log("####FULL-URL: " + fullUrl);
    var opts = { headers: {} };
    opts.headers['Authorization'] = "Token " + service.vars.roster_api_key;
    opts.method = "POST";
    opts.data = clientJSON;
    console.log("#### typeof clientjson: " + typeof clientJSON)
    console.log('####### ClientJSON:' + clientJSON);
    console.log("#### OPtions: " + JSON.stringify(opts));

    try {
        response = httpClient.request(fullUrl, opts);
        if (response.status == 200) {
            console.log('***************SUCCESS*******************' + JSON.stringify(response));
            return response.content;
        }
        else if (response.status == 409) {
            logResponse(fullUrl, response);
            var msgs = require('../msg-retrieve');
            var accountNumber = parseInt(response.content.replace(/\"/g, " "));
            sayText(msgs('enrolled_national_id', {'$AccountNumber': accountNumber}, lang));
            stopRules();
            return null;
        }
        else {
            logResponse(fullUrl, response);
            var msgs = require('../msg-retrieve');
            sayText(msgs('FAILURE_REGISTERING'), {}, lang);
            slack.log('Error Registering a new client: ' + JSON.stringify(response));
            stopRules();
            return null;
        }
    } catch (e) {
        console.log('Error' + e);
        slack.log('Error in registering a new client: ' + e);
    }

    console.log("####Failed to save" + JSON.stringify(response));

}