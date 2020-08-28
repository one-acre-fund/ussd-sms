
var translations = require('./translations');
var createTranslator = require('../utils/translator/translator');
var accountNumberHandler = require('./account-number-handler/accountNumberHandler');
var bundleChoiceHandler = require('./bundle-choice-handler/bundleChoiceHandler');
var notifyELK = require('../notifications/elk-notification/elkNotification');
var translate =  createTranslator(translations, project.vars.lang);
module.exports = {
    registerHandlers: function (){
        addInputHandler(accountNumberHandler.handlerName, accountNumberHandler.getHandler(onAccountNumberValidated));
        addInputHandler(bundleChoiceHandler.handlerName, bundleChoiceHandler.getHandler(onBundleSelected));
    },

    start: function (account, country,lang) {
        notifyELK();
        state.vars.account = account;
        state.vars.country = country;
        state.vars.jitLang = lang;
        var translate =  createTranslator(translations, state.vars.jitLang);
        global.sayText(translate('account_number_handler',{},state.vars.jitLang));
        global.promptDigits(accountNumberHandler.handlerName);
    }
};
function onBundleSelected(bundleId){
    //TO DO: call order confirmaition
    console.log('selected bundle:'+bundleId);

}
function onAccountNumberValidated(){
    var client = JSON.parse(state.vars.topUpClient);
    var remainingLoan = 0;
    if(client.BalanceHistory.length > 0){
        client.latestBalanceHistory = client.BalanceHistory[0];
        remainingLoan = client.latestBalanceHistory.TotalCredit - client.latestBalanceHistory.TotalRepayment_IncludingOverpayments;
    }
    if(remainingLoan > 500 ){
        var amountToPay = remainingLoan-500;
        global.sayText(translate('loan_payment_not_satisfied',{'$amount': amountToPay },state.vars.jitLang));
    }
    else{
        displayBundles(client.DistrictID);
        promptDigits(bundleChoiceHandler.handlerName);
    }
}

function getBundlesInputs(districtId){
    var table = project.initDataTableById(service.vars.topUpBundleTableId);
    var bundleInputs;
    var query = {};
    query['d' + districtId] = 1;
    query.offered = 1;
    var cursor = table.querryRows({'vars': query});
    while(cursor.hasNext()){
        var row = cursor.next();
        var currentBundleInput = {bundleId: row.vars.bundleId, bundleInputId: row.vars.bundleInputId, bundleName: row.vars.bundle_name, price: row.vars.price};
        bundleInputs.push(currentBundleInput);
    }
    return bundleInputs;
}
function displayBundles(district){
    var bundleInputs = getBundlesInputs(district);
    state.vars.bundleInputs = JSON.stringify(bundleInputs);
    var unique = [];
    var bundles = [];
    //get Unique bundles
    for( var i = 0; i < bundleInputs.length; i++ ){
        if( !unique[bundleInputs[i].bundleId]){
            bundles.push(bundleInputs[i]);
            unique[bundleInputs[i].bundleId] = 1;
        }
    }
    state.vars.bundles = JSON.stringify(bundles);

    var populateMenu = require('./utils/populate-menu');
    var menu = populateMenu(state.vars.jitLang,140,bundles);
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
        state.vars.input_menu_length = Object.keys(menu).length; //this will be 1 greater than max possible loc
        global.sayText(menu[state.vars.input_menu_loc]);
        state.vars.input_menu = JSON.stringify(menu);
    }

}