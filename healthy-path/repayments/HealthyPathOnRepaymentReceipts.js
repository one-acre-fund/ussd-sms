var calculateHealthyPath = require('../utils/healthyPathCalculator');
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

/**
 * generates a healthy path message to append on repayment receipt message
 * @param {Number} hp_percentage healthyPath percentage
 * @param {Number} credit the total credit
 * @param {Number} repaid the total repaid
 * @param {String} lang the language to be used 
 */
module.exports = function(hp_percentage, credit, repaid, lang) {
    var getMessage = translator(translations, lang);
    var healthyPathDistance = calculateHealthyPath(hp_percentage, credit, repaid);
    var message = '';
    if(healthyPathDistance > 0) {
        message = getMessage('healthy_path_repayment', {'$HP_DIST': healthyPathDistance}, lang);
    }
    return message;
};