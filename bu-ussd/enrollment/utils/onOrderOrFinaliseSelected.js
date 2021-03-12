var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var finalizeHandler = require('../inputHandlers/finalizeHandler');
var onKeepOrdering = require('./onKeepOrdering');

module.exports = function(lang, input) {
    var getMessage = translator(translations, lang);
    if(input == 1) {
        // continue ordering
        onKeepOrdering(lang);
    } else {
        // finalize
        var finalizeMenu = getMessage('finalize_menu', {}, lang);
        var selectedBundles = JSON.parse( state.vars.selected_bundles);
        var TotalCredit = 0;
        var orderMessage = '';
        selectedBundles.forEach(function(selectedBundle) {
            orderMessage += selectedBundle.bundleName + ' : ' + selectedBundle.bundleInputs[0].quantity + ' ' + selectedBundle.bundleInputs[0].unit + '/n';
            TotalCredit += selectedBundle.bundleInputs[0].price * selectedBundle.bundleInputs[0].quantity;
        });
        var totalCreditMessage = getMessage('total_credit', {'$amount': TotalCredit}, lang);
        orderMessage += '\n' + totalCreditMessage;
        var finalizeScreen = getMessage('finalize', {
            '$order': orderMessage,
            '$menu': finalizeMenu
        }, lang);
        state.vars.finalize_screen = finalizeScreen; 
        global.sayText(finalizeScreen);
        global.promptDigits(finalizeHandler.handlerName);
    }
};
