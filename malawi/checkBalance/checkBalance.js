var translations = require('./translations/index');
var translator = require('../../utils/translator/translator');
var nextScreenBalance = require('./inputHandlers/nextScreenBalance');

function start(lang, client) {
    var getMessage = translator(translations, lang);
    var balanceInfo = client.BalanceHistory;
    var balanceInfoScreens = {};
    balanceInfo.forEach(function(entry, index){
        var balanceMessage = getMessage('balance_info', {
            '$season': entry.SeasonName,
            '$credit': parseInt(entry.TotalCredit),
            '$balance': parseInt(entry.Balance),
            '$repaid': parseInt(entry.TotalRepayment_IncludingOverpayments)
        }, lang);
        balanceInfoScreens[index + 1] = balanceMessage;
    });
    state.vars.balance_screens = JSON.stringify(balanceInfoScreens);
    state.vars.current_season_balance = '1';
    var balanceMenu = getMessage('balance_menu', {}, lang);
    var balanceScreen = balanceInfoScreens[1] + balanceMenu;
    global.sayText(balanceScreen);
    global.promptDigits(nextScreenBalance.handlerName);
}

module.exports = {
    start: start
};