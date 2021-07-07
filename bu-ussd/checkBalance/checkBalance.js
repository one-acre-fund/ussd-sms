var translations = require('./translations/index');
var translator = require('../../utils/translator/translator');
var getHealthyPathMessage = require('../../healthy-path/balance/healthyPathOnBalance');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

/**
 * starts the check balance for Burundi
 * @param {String} language the current language to be used for translations
 * @param {Object} client a parsed javascript object for client
 */
module.exports = function start(language, client) {
    notifyELK();
    var getMessage = translator(translations, language);
    var mostRecentSeason = client.BalanceHistory[0];
    var balanceInfo = {
        firstName: client.FirstName,
        lastName: client.LastName,
        credit: mostRecentSeason.TotalCredit,
        paid: mostRecentSeason.TotalRepayment_IncludingOverpayments,
        balance: mostRecentSeason.Balance,
        overpaid: mostRecentSeason.TotalRepayment_IncludingOverpayments,
    };
    var overPaid = mostRecentSeason.TotalRepayment_IncludingOverpayments - mostRecentSeason.TotalCredit;
    var healthyPathMessage = getHealthyPathMessage(mostRecentSeason.SeasonId, client.CountryId, client.DistrictId, balanceInfo.credit, balanceInfo.paid, language);
    var balanceMessage = getMessage('balance', {
        '$firstName': balanceInfo.firstName,
        '$lastName': balanceInfo.lastName,
        '$credit': balanceInfo.credit,
        '$paid': balanceInfo.paid,
        '$balance': balanceInfo.balance,
        '$overpaid': overPaid <= 0 ? 0 : overPaid,
        '$healthyPath': healthyPathMessage
    }, language);
    global.sayText(balanceMessage);
    project.sendMessage({
        content: balanceMessage,
        to_number: contact.phone_number
    });
    console.log('balance message: ' + balanceMessage);
};
