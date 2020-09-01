
var translations = require('./translations');
var createTranslator = require('../utils/translator/translator');
var accountNumberHandler = require('./account-number-handler/accountNumberHandler');
var bundleChoiceHandler = require('./bundle-choice-handler/bundleChoiceHandler');
var notifyELK = require('../notifications/elk-notification/elkNotification');
var addOrderHandler = require('./add-order-handler/addOrderHandler');
var orderConfirmationHandler = require('./order-confirmation-handler/orderConfirmationHandler');
var translate =  createTranslator(translations, project.vars.lang);
module.exports = {
    registerHandlers: function (){
        addInputHandler(accountNumberHandler.handlerName, accountNumberHandler.getHandler(onAccountNumberValidated));
        addInputHandler(bundleChoiceHandler.handlerName, bundleChoiceHandler.getHandler(onBundleSelected));
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
    },
    //displayBundles: displayBundles() 
};

function onOrderConfirmed(){
    var client = JSON.parse(state.vars.topUpClient);
    var bundle = JSON.parse(state.vars.orders);
    var requestBundles =[];
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
        'isGroupLeader': false,
        'clientBundles': requestBundles
    };
    var enrollOrder = require('../Roster-endpoints/enrollOrder');
    enrollOrder(requestData);
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
    sayText(translate('final_order_diplay',{'$orders': orderMessage },state.vars.jitLang));
    promptDigits(orderConfirmationHandler.handlerName);

}
function onBundleSelected(bundleId){
    //TO DO: call order confirmaition
    console.log('selected bundle:'+ bundleId);
    var bundleInputs = JSON.parse(state.vars.bundleInputs);
    var selectedBundle = [];
    for( var i = 0; i < bundleInputs.length; i++ ){
        if( bundleInputs[i].bundleId == bundleId){
            selectedBundle.push(bundleInputs[i]);
        }
    }
    if(selectedBundle.length > 1 ){
        // Display the varieties(inputs)
    }
    else{
        var allBundles = [];
        if(state.vars.orders != ' '){
            allBundles = JSON.parse(state.vars.orders);
        }
        allBundles.push(selectedBundle[0]);
        console.log('orders######################33:'+JSON.stringify(allBundles));
        var orderMessage = '';
        console.log('all orders######################:'+ allBundles.length);
        for( var j = 0; j < allBundles.length; j++ ){
            console.log('all orders######################:'+JSON.stringify(allBundles[j]));
            console.log('name######################:'+allBundles[j].bundleName);
            orderMessage = orderMessage + allBundles[j].bundleName + ' ' + allBundles[j].price + '\n';
        }
        console.log('orders######################33:'+orderMessage);
        //Display confirmation message
        state.vars.orders = JSON.stringify(allBundles);
        global.sayText(translate('order_placed', {'$orders': orderMessage}, state.vars.jitLang));
        global.promptDigits(addOrderHandler.handlerName);
    }

}
function onAccountNumberValidated(){
    var client = JSON.parse(state.vars.topUpClient);
    var remainingLoan = 0;
    var districtId = client.DistrictId;
    if(client.BalanceHistory.length > 0){
        client.latestBalanceHistory = client.BalanceHistory[0];
        remainingLoan = client.latestBalanceHistory.TotalCredit - client.latestBalanceHistory.TotalRepayment_IncludingOverpayments;
    }
    if(remainingLoan > 500 ){
        var amountToPay = remainingLoan - 500;
        global.sayText(translate('loan_payment_not_satisfied',{'$amount': amountToPay },state.vars.jitLang));
    }
    else{
        //console.log('clientJSON##################'+JSON.stringify(client));
        console.log('account##################'+client.AccountNumber);
        console.log('distrits##################'+client.DistrictId);
        console.log('distrits##################'+ districtId);
        displayBundles(districtId);
        promptDigits(bundleChoiceHandler.handlerName);
    }
}

function getBundlesInputs(districtId){
    var table = project.initDataTableById(service.vars.topUpBundleTableId);
    var bundleInputs = [];
    var query = {};
    query['d' + districtId] = 1;
    query.offered = 1;
    console.log('query################' + JSON.stringify(query));
    var cursor = table.queryRows({'vars': query});
    while(cursor.hasNext()){
        var row = cursor.next();
        var currentBundleInput = {bundleId: row.vars.bundleId, bundleInputId: row.vars.bundleInputId, bundleName: row.vars.bundle_name, price: row.vars.price};
        bundleInputs.push(currentBundleInput);
        console.log('current row'+ JSON.stringify(currentBundleInput));
    }
    return bundleInputs;
}
function displayBundles(district){
    console.log('district ID:'+district);
    var bundleInputs = getBundlesInputs(district);
    state.vars.bundleInputs = JSON.stringify(bundleInputs);
    //console.log('bundleInputts:######'+state.vars.bundleInputs);
    var unique = [];
    var bundles = [];
    if(bundleInputs){
        //get Unique bundles
        for( var i = 0; i < bundleInputs.length; i++ ){
            if( !unique[bundleInputs[i].bundleId]){
                bundles.push(bundleInputs[i]);
                unique[bundleInputs[i].bundleId] = 1;
            }
        }

    }
   
    state.vars.bundles = JSON.stringify(bundles);
    //console.log('bundles#############'+state.vars.bundles);
    var populateMenu = require('./utils/populate-menu');
    var menu = populateMenu(state.vars.jitLang,140,bundles);
    //console.log('menu##############'+menu);
    if (typeof (menu) == 'string') {
        global.sayText(menu);
        state.vars.multiple_input_menus = 0;
        state.vars.input_menu = menu;
        state.vars.main_menu = menu;
    }
    else if (typeof (menu) == 'object') {
        state.vars.input_menu_loc = 0; //watch for off by 1 errors - consider moving this to start at 1
        state.vars.multiple_input_menus = 1;
        state.vars.main_menu = menu[state.vars.input_menu_loc];
        state.vars.input_menu = JSON.stringify(menu);
        state.vars.input_menu_length = Object.keys(menu).length; //this will be 1 greater than max possible loc
        global.sayText(menu[state.vars.input_menu_loc]);
        state.vars.input_menu = JSON.stringify(menu);
    }

}