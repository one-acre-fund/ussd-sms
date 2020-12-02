
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
var orderMoreHandler = require('./order-more-handler/orderMoreHandler');
module.exports = {
    registerHandlers: function (){
        addInputHandler(accountNumberHandler.handlerName, accountNumberHandler.getHandler(onAccountNumberValidated));
        addInputHandler(bundleChoiceHandler.handlerName, bundleChoiceHandler.getHandler(onBundleSelected,displayBundles));
        addInputHandler(varietyChoiceHandler.handlerName, varietyChoiceHandler.getHandler(onVarietyChosen));
        addInputHandler(varietyConfirmationHandler.handlerName, varietyConfirmationHandler.getHandler(onBundleSelected,displayBundles));
        addInputHandler(addOrderHandler.handlerName, addOrderHandler.getHandler(onFinalizeOrder,displayBundles));
        addInputHandler(orderConfirmationHandler.handlerName, orderConfirmationHandler.getHandler(onOrderConfirmed,displayBundles));
        addInputHandler(orderMoreHandler.handlerName, orderMoreHandler.getHandler(onOrderMore));

    },

    start: function (account, country,lang) {
        notifyELK();
        state.vars.account = account;
        state.vars.country = country;
        state.vars.jitLang = lang;
        state.vars.orders = ' ';
        state.vars.chosenMaizeBundle = ' ';
        state.vars.varietyWarehouse = ' ';
        state.vars.chosenVariety = ' ';
        var translate =  createTranslator(translations, state.vars.jitLang);
        global.sayText(translate('account_number_handler',{},state.vars.jitLang));
        global.promptDigits(accountNumberHandler.handlerName);
    }
};

function getAlreadyOrderedBundles(pastOrderedProducts, districtId) {
    var allSupportedBundles = getAllSupportedBundles(districtId);
    var orderedBundles = {};
    pastOrderedProducts.forEach(function(orderedProduct) {
        allSupportedBundles.forEach(function(supportedBundle) {
            if(supportedBundle.bundleId == orderedProduct.bundleId) {
                orderedBundles[supportedBundle.bundleId] = supportedBundle;
            }
        });
    });
    return Object.keys(orderedBundles).map(function(key){return orderedBundles[key];});
}

function onReturningClientValidated(districtId, pastOrderedProducts) {
    var orderMessage = '';
    var alreadyOrderedBundles = getAlreadyOrderedBundles(pastOrderedProducts, districtId);
    alreadyOrderedBundles.forEach(function(orderedBundle){
        orderMessage = orderMessage + orderedBundle.bundleName + ' ' + orderedBundle.price + '; ';
    });
    var order_more_message = translate('order_more_products', {
        '$order': orderMessage,
        '$products': pastOrderedProducts.length,
        '$more_products': 3 - pastOrderedProducts.length
    }, state.vars.jitLang);

    global.sayText(order_more_message);
    global.promptDigits(orderMoreHandler.handlerName);
}

function onOrderMore() {
    var client = JSON.parse(state.vars.topUpClient);
    //var remainingLoan = 0;
    var districtId = client.DistrictId;
    displayBundles(districtId);
    global.promptDigits(bundleChoiceHandler.handlerName); 
}

function onAccountNumberValidated(){
    var client = JSON.parse(state.vars.topUpClient);
    //var remainingLoan = 0;
    var districtId = client.DistrictId;
    if(client.BalanceHistory.length > 0){
        client.latestBalanceHistory = client.BalanceHistory[0];
        //remainingLoan = client.latestBalanceHistory.TotalCredit - client.latestBalanceHistory.TotalRepayment_IncludingOverpayments;
    }
    if(client.latestBalanceHistory.TotalRepayment_IncludingOverpayments < 500){
        var amountToPay = 500-client.latestBalanceHistory.TotalRepayment_IncludingOverpayments;
        global.sayText(translate('loan_payment_not_satisfied',{'$amount': amountToPay },state.vars.jitLang));
    }
    else{
        var pastOrderedProducts = getPastOrderedProducts();
        if(pastOrderedProducts.length > 0) {
            // is a returning client
            onReturningClientValidated(districtId, pastOrderedProducts);
        } else {
            displayBundles(districtId);
            promptDigits(bundleChoiceHandler.handlerName);
        }
    }
}
function onFinalizeOrder(){
    var orderMessage = '';
    var allBundles = [];
    if(state.vars.orders != ' '){
        allBundles = JSON.parse(state.vars.orders);
    }
    for( var j = 0; j < allBundles.length; j++ ){
        if(state.vars.chosenMaizeBundle != ' ' && (JSON.parse(state.vars.chosenMaizeBundle).bundleId == allBundles[j].bundleId)){
            var chosenBundle = JSON.parse(state.vars.chosenMaizeBundle);
            orderMessage = orderMessage + chosenBundle.bundleName + ' ' + chosenBundle.price + '\n';

        }else{
            orderMessage = orderMessage + allBundles[j].bundleName + ' ' + allBundles[j].price + '\n';
        }
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


    var bundleInputs = getBundlesInputs(state.vars.currentDistrict);
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
            var varietyStockTable = project.initDataTableById(service.vars.varietyStockTableId);
            var availableInputs =[];
            selectedBundle.forEach(function(element){
                var stockCursor = varietyStockTable.queryRows({vars: {'warehousename': state.vars.varietyWarehouse,'inputname': element.inputName}});
                if(stockCursor.hasNext()){
                    var row = stockCursor.next();
                    if(row.vars.quantityavailable > row.vars.quantityordered){
                        availableInputs.push(element);
                    }
                }
            });
            // Display the varieties(inputs)
            state.vars.varietyBundleId = bundleId;
            displayVariety(availableInputs);
            promptDigits(varietyChoiceHandler.handlerName);
            return;
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
            if(state.vars.chosenMaizeBundle != ' ' && (JSON.parse(state.vars.chosenMaizeBundle).bundleId == allBundles[j].bundleId)){
                var orderedBundle =  JSON.parse(state.vars.chosenMaizeBundle);
                orderMessage = orderMessage + orderedBundle.bundleName + ' ' + orderedBundle.price + '\n';
            }
            else{
                orderMessage = orderMessage + allBundles[j].bundleName + ' ' + allBundles[j].price + '\n';
            }  
        }
        //Display confirmation message
        state.vars.orders = JSON.stringify(allBundles);
        var orderedProducts = getPastOrderedProducts();
        if(allBundles.length == 3 || (orderedProducts.length + allBundles.length) == 3){
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
        var order;
        if(state.vars.chosenMaizeBundle != ' ' && (JSON.parse(state.vars.chosenMaizeBundle).bundleId == bundle[j].bundleId)){
            var chosenBundle = JSON.parse(state.vars.chosenMaizeBundle);
            order = {'bundleId': bundle[j].bundleId, 'bundleQuantity': chosenBundle.quantity, inputChoices: [parseInt(bundle[j].bundleInputId)] };
        }else{
            order = {'bundleId': bundle[j].bundleId, 'bundleQuantity': 1, inputChoices: [parseInt(bundle[j].bundleInputId)]};
        }
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
    var orderPlacedMessage = '';
    if(enrollOrder(requestData)){
        var orderPlaced = JSON.parse(state.vars.orders);
        console.log(orderPlaced);
        for( var m = 0; m < orderPlaced.length; m++ ){
            if(state.vars.chosenMaizeBundle != ' ' && (JSON.parse(state.vars.chosenMaizeBundle).bundleId == orderPlaced[m].bundleId)){
                var bundlechosen = JSON.parse(state.vars.chosenMaizeBundle);
                orderPlaced[m].bundleName = bundlechosen.bundleName;
                orderPlacedMessage = orderPlacedMessage + bundlechosen.bundleName + ' ' + bundlechosen.price + ' ';
            }else{
                orderPlacedMessage = orderPlacedMessage + orderPlaced[m].bundleName + ' ' + orderPlaced[m].price + ' ';
            }
        } 

        var alreadyOrderedBundles = getPastOrderedProducts(); // geting past orders for returning clients (returns an empty array for first time clients)
        var row;
        var table = project.initDataTableById(service.vars.JiTEnrollmentTableId);
        if(alreadyOrderedBundles.length > 0) {
            // if there are already placed orders, it means we need to update not create a new entry
            requestBundles.forEach(function(requestBundle){alreadyOrderedBundles.push(requestBundle);}); // adding all budnles before saving them to the dataTable
            var cursor = table.queryRows({vars: {'account_number': client.AccountNumber}});
            if(cursor.hasNext()) {
                row = cursor.next();
                row.vars.order = JSON.stringify(alreadyOrderedBundles);
            }
        } else {
            row = table.createRow({vars: {'account_number': client.AccountNumber, 'order': JSON.stringify(requestBundles)}});
        }
        row.save();
        var message = translate('final_message',{'$products': orderPlacedMessage},state.vars.jitLang);
        sayText(message);
        var bundleStockTable = project.initDataTableById(service.vars.warehouseStockTableId);
        orderPlaced.forEach(function(element){
            var stockCursor = bundleStockTable.queryRows({vars: {'warehousename': state.vars.warehouse,'bundlename': element.bundleName}});
            if(stockCursor.hasNext()){
                var row = stockCursor.next();
                row.vars.quantityordered =  row.vars.quantityordered + 1;
                row.save();
            } 
        });
        if(state.vars.chosenVariety != ' '){
            var varietyStockTable = project.initDataTableById(service.vars.varietyStockTableId);
            var vStockCursor = varietyStockTable.queryRows({vars: {'warehousename': state.vars.varietyWarehouse,'inputname': JSON.parse(state.vars.chosenVariety).inputName}});
            if(vStockCursor.hasNext()){
                var vRow = vStockCursor.next();
                vRow.vars.quantityordered =  vRow.vars.quantityordered + 1;
                vRow.save();
            }
        }
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

var getAllSupportedBundles = function (district) {
    console.log('district ID:' + district);
    var bundleInputs = getBundlesInputs(district);
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!4'+JSON.stringify(bundleInputs));
    state.vars.currentDistrict = district;
    var unique = [];
    var bundles = [];
    var maizeBanedBundleIds= [];
    var currentOrder = [];
    var maizeBundleIds = [];
    var firstTime = true;
    var newBundle;
    var maizeTable = project.initDataTableById(service.vars.maizeTableId);
    var bundleStockTable = project.initDataTableById(service.vars.warehouseStockTableId);
    var maizeCursor = maizeTable.queryRows();
    while(maizeCursor.hasNext()){
        var maizeRow = maizeCursor.next(); 
        console.log('!!!!!!!!!!!!!!!!!!!!!!?!5'+JSON.stringify(maizeRow));
        maizeBundleIds.push(maizeRow.vars.bundleId);
    }
    // Check for maize bundle in the current's client order
    if(state.vars.orders != ' '){
        currentOrder = JSON.parse(state.vars.orders);
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
                    if(currentOrder.length != 0){
                        if(!bundleExists(currentOrder,bundleInputs[i].bundleId)){
                            if((maizeBundleIds.indexOf(bundleInputs[i].bundleId) != -1) && firstTime){
                                newBundle = JSON.parse(JSON.stringify( bundleInputs[i]));
                                newBundle.bundleName = '0.5 Maize Acre';
                                newBundle.price = 4950;
                                newBundle.quantity = 0.5;
                                var stockCursor = bundleStockTable.queryRows({vars: {'warehousename': state.vars.warehouse,'bundlename': newBundle.bundleName}});
                                if(stockCursor.hasNext()){
                                    var row = stockCursor.next();
                                    if(row.vars.quantityavailable > row.vars.quantityordered){
                                        bundles.push(newBundle);
                                    }
                                }
                                bundleInputs[i].bundleName = '0.25 Maize Acre';
                                bundleInputs[i].price = 2830;
                                bundleInputs[i].quantity = 0.25;
                                firstTime = false;
                            }
                            stockCursor = bundleStockTable.queryRows({vars: {'warehousename': state.vars.warehouse,'bundlename': bundleInputs[i].bundleName}});
                            if(stockCursor.hasNext()){
                                row = stockCursor.next();
                                if(row.vars.quantityavailable > row.vars.quantityordered){
                                    bundles.push(bundleInputs[i]);
                                }
                            }
                        }
                    }
                    else{
                        console.log('!!!!!!!!!!!!!!!!!!!!!!!7'+JSON.stringify(bundleInputs)+firstTime);
                        if((maizeBundleIds.indexOf(bundleInputs[i].bundleId) != -1) && firstTime){
                            console.log('!!!!!!!!!!!!!!!!!!!!!!!7.5'+JSON.stringify(bundleInputs));
                            newBundle = JSON.parse(JSON.stringify( bundleInputs[i]));
                            newBundle.bundleName = '0.5 Maize Acre';
                            newBundle.price = 4950;
                            newBundle.quantity = 0.5;
                            stockCursor = bundleStockTable.queryRows({vars: {'warehousename': state.vars.warehouse,'bundlename': newBundle.bundleName}});
                            if(stockCursor.hasNext()){
                                row = stockCursor.next();
                                if(row.vars.quantityavailable > row.vars.quantityordered){
                                    bundles.push(newBundle);
                                }
                            }
                            bundleInputs[i].bundleName = '0.25 Maize Acre';
                            bundleInputs[i].price = 2830;
                            bundleInputs[i].quantity = 0.25;
                            firstTime = false;
                        }
                        stockCursor = bundleStockTable.queryRows({vars: {'warehousename': state.vars.warehouse,'bundlename': bundleInputs[i].bundleName}});
                        if(stockCursor.hasNext()){
                            row = stockCursor.next();
                            if(row.vars.quantityavailable > row.vars.quantityordered){
                                bundles.push(bundleInputs[i]);
                            }
                        }
                    }
                }
                unique[bundleInputs[i].bundleId] = 1;
            }
        }
    }
    console.log('!!!!!!!!!!!!!!!!!!!!!!!'+JSON.stringify(bundles));
    return bundles;
};

function displayBundles(district){

    var allSupportedBundles = getAllSupportedBundles(district);
    console.log('#########$###############33'+JSON.stringify(allSupportedBundles))
    // remove the already ordered bundles for returning clients
    var bundles = removeOrderedBundles(allSupportedBundles);

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

var removeOrderedBundles = function(allBundles) {
    var orderedBundles = getPastOrderedProducts();
    var copiedBundles = allBundles.map(function(bundle) {return bundle;});
    orderedBundles.forEach(function(orderedBundle) {
        copiedBundles = copiedBundles.filter(function(bundle) {
            return bundle.bundleId != orderedBundle.bundleId;
        });
    });
    return copiedBundles;
};

var getPastOrderedProducts = function() {
    var toppedUpTable = project.initDataTableById(service.vars.JiTEnrollmentTableId);
    var client = JSON.parse(state.vars.topUpClient);
    var toppedUpCursor = toppedUpTable.queryRows({
        vars: {
            'account_number': client.AccountNumber
        }
    });

    if(toppedUpCursor.hasNext()) {
        var toppedUpRow = toppedUpCursor.next();
        var toppedUpOrderBundles = JSON.parse(toppedUpRow.vars.order);
        return toppedUpOrderBundles;
    }
    return [];
};

function bundleExists(bundles,bundleId) {
    for (var o =0; o<bundles.length; o++){
        if(bundles[o].bundleId === bundleId)
            return true;
    }
    return false; 
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