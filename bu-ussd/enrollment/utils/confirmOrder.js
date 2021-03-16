var CheckGroupLeader = require('../../../shared/rosterApi/checkForGroupLeader');
var enrollOrder = require('../../../Roster-endpoints/enrollOrder');
var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var getPhoneNumber = require('../../../shared/rosterApi/getPhoneNumber');

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
        // create a list of products
        var productsMessage = getMessage('order', {}, lang);
        // loop over them creating a list
        selectedBundles.forEach(function(selectedBundle, index){
            productsMessage += index + 1 + ') ' + selectedBundle.bundleName + '\n';
        });
        // show order on the screen
        global.sayText(productsMessage);
        // get phone
        var phoneNumbers = getPhoneNumber(client.AccountNumber, 'BI');
        var activePhones = filterActivePhones(phoneNumbers);
        // send message.
        project.sendMessage({
            content: productsMessage,
            to_number: activePhones[0].PhoneNumber || contact.phone_number,
        });
        global.stopRules();
    } else {
        // display an error
        global.sayText(getMessage('error_enrolling', {}, lang));
        global.stopRules();
    }
};

function filterActivePhones(phoneNumbers) {
    return phoneNumbers.filter(function(phoneNumber) {
        return phoneNumber.IsInactive == false;
    });
}