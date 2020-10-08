var calculateHealthyPath = require('../utils/healthyPathCalculator');
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var fetchHealthyPath = require('../utils/getHealthyPathPercentage');

/**
 * generates a healthy path message to append on balance screen
 * @param {Number} credit the total credit
 * @param {Number} repaid the total repaid
 * @param {String} lang the language to be used 
 */
module.exports = function(credit, repaid, lang) {
    var getMessage = translator(translations, lang);
    var hp_percentage = fetchHealthyPath();
    var healthyPathDistance = calculateHealthyPath(hp_percentage, credit, repaid);
    var status = '';
    if(healthyPathDistance > 0) {
        status = 'below';
    } else {
        status = 'above';
    }
    var message = getMessage('healthy_path_balance', {'$HP_DIST': Math.abs(healthyPathDistance), '$status': status}, lang);
    return message;
};
