var calculateHealthyPath = require('../utils/healthyPathCalculator');
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var fetchHealthyPath = require('../utils/fetchHealthyPathData');

/**
 * generates a healthy path message to append on repayment receipt message
 * @param {Number} credit the total credit
 * @param {Number} repaid the total repaid
 * @param {String} lang the language to be used 
 */
module.exports = function(credit, repaid, lang) {
    var getMessage = translator(translations, lang);
    var hp_percentage = fetchHealthyPath();
    var healthyPathDistance = calculateHealthyPath(hp_percentage, credit, repaid);
    var message = '';
    if(healthyPathDistance > 0) {
        message = getMessage('healthy_path_repayment', {'$HP_DIST': healthyPathDistance}, lang);
    }
    return message;
};
