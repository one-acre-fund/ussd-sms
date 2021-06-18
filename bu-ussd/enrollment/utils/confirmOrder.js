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
            bundleQuantity: bundle.bundleInputs[0].quantity,
            inputChoices: bundle.bundleInputs.map(function(inputBundle) {return inputBundle.bundleInputId;})
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
        var TotalCredit = 0;
        // loop over them creating a list
        selectedBundles.forEach(function(selectedBundle) {
            productsMessage += selectedBundle.bundleName + ': ' + selectedBundle.bundleInputs[0].quantity + ' ' + selectedBundle.bundleInputs[0].unit + '/' + selectedBundle.bundleInputs[0].price + '\n';
            TotalCredit += selectedBundle.bundleInputs[0].price * selectedBundle.bundleInputs[0].quantity;
        });
        var totalCreditMessage = getMessage('total_credit', {'$amount': TotalCredit}, lang);
        productsMessage += totalCreditMessage;
        // show order on the screen
        global.sayText(productsMessage);
        // get phone
        var phoneNumbers = getPhoneNumber(client.AccountNumber, 'BI');
        var activePhones = filterActivePhones(phoneNumbers);
        // send message.
        project.sendMessage({
            content: productsMessage,
            to_number: activePhones[0] && activePhones[0].PhoneNumber || contact.phone_number,
        });
        // store the state.vars.selected_bundles into the orders table.
        var ordersTable = project.initDataTableById(service.vars.orders_table_id);
        var row = ordersTable.createRow({
            vars: {
                'account_number': client.AccountNumber,
                'order': state.vars.selected_bundles,
                'phone_number': contact.phone_number
            }
        });
        row.save();
        var clientsTable = project.initDataTableById(service.vars.client_table_id);
        var cursor = clientsTable.queryRows({vars: {'account_number': client.AccountNumber}});
        var clientRow;
        if(cursor.hasNext())
        {
            clientRow = cursor.next();
            clientRow.vars.finalized = 1;
        }
        else{
            clientRow = clientsTable.createRow({vars: {'account_number': client.AccountNumber, 'finalized': 1}});
        }
        clientRow.save();
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