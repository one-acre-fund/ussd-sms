
var translations = require('./translations');
var createTranslator = require('../utils/translator/translator');
var accountNumberHandler = require('./account-number-handler/accountNumberHandler');
var bundleChoiceHandler = require('./bundle-choice-handler/bundleChoiceHandler');
var varietyChoiceHandler = require('./variety-choice-handler/varietyChoiceHandler');
var varietyConfirmationHandler = require('./variety-confirmation-handler/varietyConfirmationHandler');
var addOrderHandler = require('./add-order-handler/addOrderHandler');
var orderConfirmationHandler = require('./order-confirmation-handler/orderConfirmationHandler');
var notifyELK = require('../notifications/elk-notification/elkNotification');
var enrollOrder = require('../Roster-endpoints/enrollOrder');
var translate =  createTranslator(translations, project.vars.lang);
var getPhoneNumber = require('../shared/rosterApi/getPhoneNumber');

module.exports = {
    registerHandlers: function (){
        addInputHandler(accountNumberHandler.handlerName, accountNumberHandler.getHandler(onAccountNumberValidated));
        addInputHandler(bundleChoiceHandler.handlerName, bundleChoiceHandler.getHandler(onBundleSelected));
        addInputHandler(varietyChoiceHandler.handlerName, varietyChoiceHandler.getHandler(onVarietyChosen));
        addInputHandler(varietyConfirmationHandler.handlerName, varietyConfirmationHandler.getHandler(onBundleSelected));
        addInputHandler(addOrderHandler.handlerName, addOrderHandler.getHandler(onFinalizeOrder,displayBundles));
        addInputHandler(orderConfirmationHandler.handlerName, orderConfirmationHandler.getHandler(onOrderConfirmed));

    },

    start: function (account, country,lang) {
        notifyELK();
        state.vars.account = account;
        state.vars.country = country;
        state.vars.jitLang = lang;
        state.vars.orders = ' ';
        var translate =  createTranslator(translations, state.vars.jitLang);
        global.sayText(translate('account_number_handler',{},state.vars.jitLang));
        global.promptDigits(accountNumberHandler.handlerName);
    }
};

function onAccountNumberValidated(){
    var client = JSON.parse(state.vars.topUpClient);
    var remainingLoan = 0;
    var districtId = client.DistrictId;
    if(client.BalanceHistory.length > 0){
        client.latestBalanceHistory = client.BalanceHistory[0];
        remainingLoan = client.latestBalanceHistory.TotalCredit - client.latestBalanceHistory.TotalRepayment_IncludingOverpayments;
    }
    if(remainingLoan > 500 ){
        var amountToPay = remainingLoan-500;
        global.sayText(translate('loan_payment_not_satisfied',{'$amount': amountToPay },state.vars.jitLang));
    }
    else{
        displayBundles(districtId);
        promptDigits(bundleChoiceHandler.handlerName);
    }
}
function onFinalizeOrder(){
    var orderMessage = '';
    var allBundles = [];
    if(state.vars.orders != ' '){
        allBundles = JSON.parse(state.vars.orders);
    }
    for( var j = 0; j < allBundles.length; j++ ){
        orderMessage = orderMessage + allBundles[j].bundleName + ' ' + allBundles[j].price + '\n';
    }
    sayText(translate('final_order_display',{'$orders': orderMessage },state.vars.jitLang));
    promptDigits(orderConfirmationHandler.handlerName);

}


function onVarietyChosen(bundleInput){

    console.log('varieties in onvarietychosen'+ JSON.stringify(bundleInput));
    state.vars.chosenVariety = JSON.stringify(bundleInput);
    console.log('varieties in onvarietychosen'+JSON.parse(state.vars.chosenVariety));
    sayText(translate('variety_confirmation',{'$bundleName': bundleInput.bundleName, '$inputName': bundleInput.inputName},state.vars.jitLang));
    promptDigits(varietyConfirmationHandler.handlerName);
}

function onBundleSelected(bundleId, varietychosen, bundleInputId){


    var bundleInputs = JSON.parse(state.vars.bundleInputs);
    var selectedBundle = [];
    for( var i = 0; i < bundleInputs.length; i++ ){
        if( bundleInputs[i].bundleId == bundleId){
            selectedBundle.push(bundleInputs[i]);
        }
    }
    // It means there are more bundleInputs for one bundle(should display the varieties)
    if(selectedBundle.length > 1 ){
        // check if the user already selected a variety
        if(varietychosen){
            selectedBundle = [];
            for(i = 0; i < bundleInputs.length; i++ ){
                if( bundleInputs[i].bundleInputId == bundleInputId){
                    selectedBundle.push(bundleInputs[i]);
                }
            }
        }
        else{
            // Display the varieties(inputs)
            state.vars.allVarieties = JSON.stringify(selectedBundle);
            displayVariety(selectedBundle);
            promptDigits(varietyChoiceHandler.handlerName);
        }
    }
    if(selectedBundle.length == 1){
        var allBundles = [];
        if(state.vars.orders != ' '){
            allBundles = JSON.parse(state.vars.orders);
        }
        allBundles.push(selectedBundle[0]);
        var orderMessage = '';
        for( var j = 0; j < allBundles.length; j++ ){
            orderMessage = orderMessage + allBundles[j].bundleName + ' ' + allBundles[j].price + '\n';
        }
        //Display confirmation message
        state.vars.orders = JSON.stringify(allBundles);
        if(allBundles.length == 2){
            sayText(translate('final_order_display',{'$orders': orderMessage },state.vars.jitLang));
            promptDigits(orderConfirmationHandler.handlerName);
        }
        else{
            global.sayText(translate('order_placed', {'$orders': orderMessage}, state.vars.jitLang));
            global.promptDigits(addOrderHandler.handlerName);
        }
    }

}

function onOrderConfirmed(){
    var client = JSON.parse(state.vars.topUpClient);
    var bundle = JSON.parse(state.vars.orders);
    var requestBundles = [];
    var group_leader_check = require('../shared/rosterApi/checkForGroupLeader');
    var isGroupLeader = group_leader_check(client.DistrictId, client.ClientId);

    for( var j = 0; j < bundle.length; j++ ){
        var order = {'bundleId': bundle[j].bundleId, 'bundleQuantity': 1, inputChoices: [parseInt(bundle[j].bundleInputId)] };
        requestBundles.push(order);
    }
    var requestData = {
        'districtId': client.DistrictId,
        'siteId': client.SiteId,
        'groupId': client.GroupId,
        'accountNumber': client.AccountNumber,
        'clientId': client.ClientId,
        'isGroupLeader': isGroupLeader,
        'clientBundles': requestBundles
    };
   
    if(enrollOrder(requestData)){
        var message = translate('final_message',{},state.vars.jitLang);
        sayText(message);
        project.sendMessage({
            content: message, 
            to_number: contact.phone_number
        });
        var phone_numbers = getPhoneNumber(client.AccountNumber, client.CountryName);
        if(phone_numbers) {
            var active_phone_numbers = phone_numbers.filter(function(phone_number) {
                return !phone_number.IsInactive;
            });
            project.sendMessage({
                content: message,
                to_number: active_phone_numbers[0].PhoneNumber,
            });
        }
    }
    else{
        sayText(translate('enrollment_failed',{},state.vars.jitLang));
    }
}
function displayBundles(district){
    console.log('district ID:' + district);
    var bundleInputs = getBundlesInputs(district);
     
    state.vars.bundleInputs = JSON.stringify(bundleInputs);
    var unique = [];
    var bundles = [];
    var maizeBanedBundleIds= [];

    // Check for maize bundle in the current's client order
    if(state.vars.orders != ' '){
        var maizeTable = project.initDataTableById(service.vars.maizeTableId);
        var currentOrder = JSON.parse(state.vars.orders);
        var maizeBundleIds = [];
        var maizeCursor = maizeTable.queryRows();

        while(maizeCursor.hasNext()){
            var maizeRow = maizeCursor.next(); 
            maizeBundleIds.push(maizeRow.vars.bundleId);
        }
        for (var k = 0; k < currentOrder.length; k++){
            if(maizeBundleIds.indexOf(currentOrder[k].bundleId) != -1){
                maizeBanedBundleIds = maizeBundleIds;
            }
        }   
    }
    if(bundleInputs){
        //get Unique bundles
        for( var i = 0; i < bundleInputs.length; i++ ){
            if( !unique[bundleInputs[i].bundleId]){
                //check for not allowed bundles
                if(maizeBanedBundleIds.indexOf(bundleInputs[i].bundleId) == -1){
                    bundles.push(bundleInputs[i]);
                }
                unique[bundleInputs[i].bundleId] = 1;
            }
        }
    }
    
    // saved it for easy access in bundleChoiceHandler 
    state.vars.bundles = JSON.stringify(bundles);
    
    // Build the menu for bundles
    var populateMenu = require('./utils/populate-bundles');
    var menu = populateMenu(state.vars.jitLang,140,bundles);
    if (typeof (menu) == 'string') {
        global.sayText(menu);
        state.vars.multiple_input_menus = 0;
        state.vars.input_menu = menu;
        state.vars.main_menu = menu;
    }
    else if (typeof (menu) == 'object') {
        state.vars.input_menu_loc = 0;
        state.vars.multiple_input_menus = 1;
        state.vars.main_menu = menu[state.vars.input_menu_loc];
        state.vars.input_menu = JSON.stringify(menu);
        state.vars.input_menu_length = Object.keys(menu).length;
        global.sayText(menu[state.vars.input_menu_loc]);
        state.vars.input_menu = JSON.stringify(menu);
    }

}

function getBundlesInputs(districtId){
    var table = project.initDataTableById(service.vars.topUpBundleTableId);
    var bundleInputs = [];
    var query = {};
    query['d' + districtId] = 1;
    query.offered = 1;
    var cursor = table.queryRows({'vars': query});
    while(cursor.hasNext()){
        var row = cursor.next();
        var currentBundleInput = {bundleId: row.vars.bundleId, bundleInputId: row.vars.bundleInputId, bundleName: row.vars.bundle_name, price: row.vars.price, inputName: row.vars.input_name};
        bundleInputs.push(currentBundleInput);
    }
    return bundleInputs;
}

function displayVariety(selectedBundle){

    var populateMenu = require('./utils/populate-bundles');
    var menu = populateMenu(state.vars.jitLang,140,selectedBundle,true);
    if (typeof (menu) == 'string') {
        global.sayText(menu);
        state.vars.multiple_input_menus = 0;
        state.vars.input_menu = menu;
        state.vars.main_menu = menu;
    }
    else if (typeof (menu) == 'object') {
        state.vars.input_menu_loc = 0;
        state.vars.multiple_input_menus = 1;
        state.vars.main_menu = menu[state.vars.input_menu_loc];
        state.vars.input_menu = JSON.stringify(menu);
        state.vars.input_menu_length = Object.keys(menu).length;
        global.sayText(menu[state.vars.input_menu_loc]);
        state.vars.input_menu = JSON.stringify(menu);
    }

}