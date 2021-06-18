var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var finalizeHandler = require('../inputHandlers/finalizeHandler');
var onKeepOrdering = require('./onKeepOrdering');
var splitMenu = require('../../../shared/splitLongMenu');

module.exports = function(lang, input) {
    var getMessage = translator(translations, lang);
    var all_bundles = JSON.parse(state.vars.bundles);
    var selected_bundles = JSON.parse(state.vars.selected_bundles);
    if(input == 1 && all_bundles.length > selected_bundles.length) {
        // continue ordering
        onKeepOrdering(lang);
    } else {
        // finalize
        var finalizeMenu = getMessage('finalize_menu', {}, lang);
        var selectedBundles = JSON.parse(state.vars.selected_bundles);
        var TotalCredit = 0;
        var orderMessage = '';
        selectedBundles.forEach(function(selectedBundle) {
            orderMessage += selectedBundle.bundleName + ' : ' + selectedBundle.bundleInputs[0].quantity + ' ' + selectedBundle.bundleInputs[0].unit + '\n';
            TotalCredit += selectedBundle.bundleInputs[0].price * selectedBundle.bundleInputs[0].quantity;
        });
        var totalCreditMessage = getMessage('total_credit', {'$amount': TotalCredit}, lang);
        orderMessage += '\n' + totalCreditMessage;
        var client = JSON.parse(state.vars.enrolling_client);
        var finalizeScreen = getMessage('finalize', {
            '$order': orderMessage,
            '$firstName': client.FirstName,
            '$lastName': client.LastName
        }, lang);
        var menus = splitMenu(finalizeScreen,getMessage('next_screen', {}),finalizeMenu);
        global.sayText(menus[1]);
        state.vars.current_input_menu = 1;
        state.vars.OnOrderFinalizeMenus = JSON.stringify(menus); 
        global.promptDigits(finalizeHandler.handlerName);
    }
};
