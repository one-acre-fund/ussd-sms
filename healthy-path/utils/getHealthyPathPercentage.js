var slack = require('../../slack-logger/index');
var getHealthyPathData = require('../../shared/rosterApi/getHealthyPathData');

/**
 * Returns the healthy path percentage
 * @param {Number} SeasonId Season id
 * @param {Number} CountryId Country id
 * @param {Number} DistrictId District id
 */
module.exports = function(SeasonId, CountryId, DistrictId) {
    try {
        var healthyPathData = getHealthyPathData(SeasonId, CountryId, DistrictId);
        var currentWeekHealthyPathData = healthyPathData.filter(function(entry) {
            var compareDate = moment();
            var startDate   = moment(entry.StartDate);
            var endDate     = moment(entry.EndDate);
            return compareDate >= startDate && compareDate <= endDate;
        });
        console.log('healthy path: ' + JSON.stringify({hpd: currentWeekHealthyPathData}));
        if(currentWeekHealthyPathData[0]) {
            return currentWeekHealthyPathData[0].HealthyPathTarget;
        }
        console.log('API returned empty healthy path or an error during week number calculation' + JSON.stringify({content: healthyPathData}));
        slack.log('API returned empty healthy path or an error during week number calculation' + JSON.stringify({content: healthyPathData}));
    } catch(error) {
        console.log('error===>' + JSON.stringify({error: error}));
        slack.log(error);
    }
};