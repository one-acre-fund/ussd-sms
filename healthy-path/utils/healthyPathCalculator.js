
/**
 * Calculates the distance from healthyPath
 * @param {Number} hp_percentage healthyPath percentage
 * @param {Number} credit the total credit
 * @param {Number} repaid the total repaid
 * @returns HealthyPath
 */
module.exports = function calculateHealthPath(hp_percentage, credit, repaid) {
    var healthyPath = (hp_percentage * credit) - repaid;
    return healthyPath;
};
