var CheckGroupLeader = require('../../../shared/rosterApi/checkForGroupLeader');
var enrollOrder = require('../../../Roster-endpoints/enrollOrder');
var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');

module.exports = function(lang) {
    // place order and send a message of the order
    var getMessage = translator(translations, lang);
    var selectedBundles = JSON.parse(state.vars.selected_bundles);
    var client = JSON.parse(state.vars.enrolling_client);
    // create payload for the api request.
    var bundles = selectedBundles.map(function(bundle) {
        return {
            bundleId: bundle.bundleId,
            bundleQuantity: bundle.inputBundles[0].quantity,
            inputChoices: bundle.inputBundles.map(function(inputBundle) {return inputBundle.bundleInputId;})
        };
    });
    var isGroupLeader = CheckGroupLeader(client.DistrictId, client.ClientId);
    var requestData = {
        districtId: client.DistrictId,
        siteId: client.SiteId,
        groupId: client.GroupId,
        accountNumber: client.AccountNumber,
        clientId: client.ClientId,
        isGroupLeader: !!isGroupLeader,
        clientBundles: bundles
    };
    var enrolled = enrollOrder(requestData);
    if(enrolled) {
        // send message.
    } else {
        // display an error
        global.sayText(getMessage('error_enrolling', {}, lang));
    }
};