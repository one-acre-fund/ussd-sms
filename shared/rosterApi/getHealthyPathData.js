var Log = require('../../logger/elk/elk-logger');

/**
 * Fetches the healthy path data
 * @param {Number} SeasonId season id
 * @param {Number} CountryId country id
 * @param {Number} DistrictId district id
 */
module.exports = function GetHealthyPathData(SeasonId, CountryId, DistrictId) {
    var logger = new Log();
    var fullUrl = service.vars.server_name + '/Api/HealthyPath/HealthyPath?SeasonId=' + SeasonId + '&CountryId=' + CountryId + '&DistrictId=' + DistrictId;
    var opts = { headers: {} };
    opts.headers['Content-Type'] = 'application/json';
    opts.method = 'GET';
    try {
        var response = httpClient.request(fullUrl, opts);
        if (response.status == 200) {
            var data = JSON.parse(response.content);
            return data;
        }
        else {
            console.log('Error while fetching healthy path data');
            console.log(JSON.stringify(response));
            logger.error('Error while fetching healthy path data', {data: JSON.stringify(response)});
        }
    } catch (error) {
        logger.error('API Error while fetching healthy path data', {data: JSON.stringify(error)});
    }
};
