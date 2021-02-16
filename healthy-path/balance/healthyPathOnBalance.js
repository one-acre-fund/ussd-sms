var calculateHealthyPath = require('../utils/healthyPathCalculator');
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var fetchHealthyPathPercentage = require('../utils/getHealthyPathPercentage');

/**
 * generates a healthy path message to append on balance screen
 * @param {Number} SeasonId season id
 * @param {Number} CountryId country id
 * @param {Number} DistrictId district id 
 * @param {Number} credit the total credit
 * @param {Number} repaid the total repaid
 * @param {String} lang the language to be used 
 */
module.exports = function(SeasonId, CountryId, DistrictId, credit, repaid, lang) {
    var getMessage = translator(translations, lang);
    var hp_percentage = fetchHealthyPathPercentage(SeasonId, CountryId, DistrictId);
    var healthyPathDistance = calculateHealthyPath(hp_percentage, credit, repaid);
    var status = '';
    if(healthyPathDistance > 0) {
        status = getMessage('status_below', {}, lang);
    } else {
        status = getMessage('status_above', {}, lang);
    }
    var message = getMessage('healthy_path_balance', {'$HP_DIST': Math.abs(healthyPathDistance), '$status': status}, lang);
    return healthyPathDistance.toString() == 'NaN' ? '' : message;
};
