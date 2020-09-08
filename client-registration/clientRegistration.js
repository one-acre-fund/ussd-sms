var translations = require('./translations');
var populateMenu = require('../just-in-time/utils/populate-bundles');
var createTranslator = require('../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var rosterRegisterClient = require('../rw-legacy/lib/roster/register-client');
var notifyELK = require('../notifications/elk-notification/elkNotification');
var confirmNationalIdHandler = require('./confirm-national-id-handler/confirmNationalIdHandler');
var confirmPhoneNumberHandler = require('./confirm-phone-number-hundler/confirmPhoneNumberHandler');
var firstNameHandler = require('./first-name-handler/firstNameHandler');
var nationalIdHandler = require('./national-id-handler/nationalIdHandler');
var phoneNumberHandler = require('./phone-number-handler/phoneNumberHandler');
var secondNameHandler = require('./second-name-handler/secondNameHandler');
var groupLeaderQuestionHander = require('./group-leader-question-handler/groupLeaderQuestionHandler');
var bundleChoiceHandler = require('./bundle-choice-handler/bundleChoiceHandler');
var varietyChoiceHandler = require('./variety-choice-handler/varietyChoiceHandler');
var orderConfirmationHandler = require('./order-confirmation-handler/orderConfirmationHandler');
var addOrderHandler = require('./add-order-handler/addOrderHandler');
var varietyConfirmationHandler = require('./variety-confirmation-handler/varietyConfirmationHandler');
var enrollOrder = require('../Roster-endpoints/enrollOrder');
module.exports = {
    registerHandlers: function (){
        
        function onNationalIdValidated(nationalId){
            var table = project.initDataTableById(service.vars.lr_2021_client_table_id);
            var rows = table.queryRows({'vars': {'national_id': nationalId}});
            if(rows.hasNext()){
                var row = rows.next();
                global.sayText(translate('duplicate_national_id',{'$AccountNumber': row.vars.account_number},state.vars.reg_lang)); 
            }
            else{
                state.vars.nationalId = nationalId;
                global.sayText(translate('confirm_national_id',{'$nationalId': nationalId},state.vars.reg_lang));
                global.promptDigits(confirmNationalIdHandler.handlerName);
            }
        }
        function onNationalIdConfirmation(){
            global.sayText(translate('first_name_prompt',{},state.vars.reg_lang));
            global.promptDigits(firstNameHandler.handlerName);
        }
        function onFirstNameReceived(firstName){
            state.vars.firstName = firstName;
            global.sayText(translate('second_name_prompt',{},state.vars.reg_lang));
            global.promptDigits(secondNameHandler.handlerName);
        }
        function onSecondNameReceived(lastName){
            state.vars.lastName = lastName;
            global.sayText(translate('phone_number_prompt',{},state.vars.reg_lang));
            global.promptDigits(phoneNumberHandler.handlerName);
        }
        function onPhoneNumberValidated(phoneNumber){
            state.vars.phoneNumber = phoneNumber;
            global.sayText(translate('confrm_phone_prompt',{'$phone': phoneNumber},state.vars.reg_lang));
            global.promptDigits(confirmPhoneNumberHandler.handlerName);
        }
        function onPhoneNumberConfirmed(){
            if(state.vars.canEnroll){
                //display bundles
                saveClientInRoster();
                displayBundles(JSON.parse(state.vars.newClient).DistrictId); 
                global.promptDigits(bundleChoiceHandler.handlerName);
            }
            else{
                global.sayText(translate('reg_group_leader_question',{},state.vars.reg_lang));
                global.promptDigits(groupLeaderQuestionHander.handlerName);
            }
        }
        function onGroupLeaderQuestion(){
            saveClientInRoster();
        }
        addInputHandler(confirmNationalIdHandler.handlerName, confirmNationalIdHandler.getHandler(onNationalIdConfirmation));
        addInputHandler(confirmPhoneNumberHandler.handlerName, confirmPhoneNumberHandler.getHandler(onPhoneNumberConfirmed));
        addInputHandler(firstNameHandler.handlerName, firstNameHandler.getHandler(onFirstNameReceived));
        addInputHandler(nationalIdHandler.handlerName, nationalIdHandler.getHandler(onNationalIdValidated));
        addInputHandler(phoneNumberHandler.handlerName, phoneNumberHandler.getHandler(onPhoneNumberValidated));
        addInputHandler(secondNameHandler.handlerName, secondNameHandler.getHandler(onSecondNameReceived));
        addInputHandler(groupLeaderQuestionHander.handlerName, groupLeaderQuestionHander.getHandler(onGroupLeaderQuestion));
        addInputHandler(bundleChoiceHandler.handlerName, bundleChoiceHandler.getHandler(onBundleSelected));
        addInputHandler(varietyChoiceHandler.handlerName, varietyChoiceHandler.getHandler(onVarietyChosen));
        addInputHandler(orderConfirmationHandler.handlerName, orderConfirmationHandler.getHandler(onOrderConfirmed));
        addInputHandler(addOrderHandler.handlerName, addOrderHandler.getHandler(onFinalizeOrder,displayBundles));
        addInputHandler(varietyConfirmationHandler.handlerName, varietyConfirmationHandler.getHandler(onBundleSelected));
    },
    

    start: function (account, country,lang) {
        notifyELK();
        state.vars.account = account;
        state.vars.country = country;
        state.vars.reg_lang = lang;
        state.vars.orders = ' ';
        global.sayText(translate('national_id_handler',{},state.vars.reg_lang));
        global.promptDigits(nationalIdHandler.handlerName);
    }
};

function saveClientInRoster(){
    var client = JSON.parse(state.vars.client_json);
    var clientJSON = {
        'districtId': client.DistrictId,
        'siteId': client.SiteId,
        'groupId': client.GroupId,
        'firstName': state.vars.firstName,
        'lastName': state.vars.lastName,
        'nationalIdNumber': state.vars.nationalId,
        'phoneNumber': state.vars.phoneNumber
    };
    try {
        var clientData = JSON.parse(rosterRegisterClient(clientJSON,state.vars.reg_lang));
        
        if(clientData){
            state.vars.newClient = JSON.stringify(clientData);
            var getFOInfo = require('../Roster-endpoints/Fo-info/getFoInfo');
            var foInfo = getFOInfo(clientData.DistrictId,clientData.SiteId,state.vars.reg_lang);
            var message;
            if((foInfo == null) || (foInfo.phoneNumber == null || foInfo.phoneNumber == undefined)){
                message = translate('reg_complete_message_no_phone' , {'$ACCOUNT_NUMBER': clientData.AccountNumber}, state.vars.reg_lang);
            }
            else{
                message = translate('reg_complete_message' , {'$ACCOUNT_NUMBER': clientData.AccountNumber,'$FOphone': foInfo.phoneNumber}, state.vars.reg_lang);
            }
            sayText(message);
            var groupLeaderInterested;
            if(state.vars.canEnroll){
                groupLeaderInterested = '0';
            }
            else {
                groupLeaderInterested = state.vars.groupLeader;
            }
            project.sendMessage({content: message, to_number: contact.phone_number});
            project.sendMessage({content: message, to_number: clientJSON.phoneNumber});
            var table = project.initDataTableById(service.vars.lr_2021_client_table_id);
            var row = table.createRow({
                'contact_id': contact.id,
                vars: {
                    'account_number': clientData.AccountNumber,
                    'national_id': clientData.NationalId,
                    'client_phone_number': clientJSON.phoneNumber,
                    'first_name': clientData.FirstName,
                    'last_name': clientData.LastName,
                    'district': clientData.DistrictId,
                    'site': clientData.SiteId,
                    'new_client': '1',
                    'gl_interested': groupLeaderInterested,
                    'gl_phone_number': contact.phone_number,

                }
            });
            row.save();
        }
    }
    catch (e) {
        console.log('error getting account number from roster' + e);
    }
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
            //TODO: prompt for varietie
            global.promptDigits(varietyChoiceHandler.handlerName);
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
        if(allBundles.length == 3){
            global.sayText(translate('final_order_display',{'$orders': orderMessage }, state.vars.reg_lang));
            global.promptDigits(orderConfirmationHandler.handlerName);
        }
        else{
            global.sayText(translate('order_placed', {'$orders': orderMessage}, state.vars.reg_lang));
            global.promptDigits(addOrderHandler.handlerName);

        }
    }

}
function onVarietyChosen(bundleInput){
    state.vars.chosenVariety = JSON.stringify(bundleInput);
    console.log('varieties in onvarietychosen'+JSON.parse(state.vars.chosenVariety));
    global.sayText(translate('variety_confirmation',{'$bundleName': bundleInput.bundleName, '$inputName': bundleInput.inputName},state.vars.reg_lang));
    global.promptDigits(varietyConfirmationHandler.handlerName);
}

function onOrderConfirmed(){
    var client = JSON.parse(state.vars.newClient);
    var glClient = JSON.parse(state.vars.client_json);
    var bundle = JSON.parse(state.vars.orders);
    var requestBundles = [];
    //var group_leader_check = require('../shared/rosterApi/checkForGroupLeader');
    //var isGroupLeader = group_leader_check(client.DistrictId, client.ClientId);

    for( var j = 0; j < bundle.length; j++ ){
        var order = {'bundleId': bundle[j].bundleId, 'bundleQuantity': 1, inputChoices: [parseInt(bundle[j].bundleInputId)] };
        requestBundles.push(order);
    }
    var requestData = {
        'districtId': client.DistrictId,
        'siteId': client.SiteId,
        'groupId': glClient.GroupId,
        'accountNumber': client.AccountNumber,
        'clientId': client.ClientId,
        'isGroupLeader': 'false',
        'clientBundles': requestBundles
    };
   
    if(enrollOrder(requestData)){
        var message = translate('final_message',{},state.vars.reg_lang);
        global.sayText(message);
        project.sendMessage({
            content: message, 
            to_number: contact.phone_number
        });
        project.sendMessage({
            content: message, 
            to_number: state.vars.phoneNumber
        });
    }
    else{
        global.sayText(translate('enrollment_failed',{},state.vars.reg_lang));
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
    global.sayText(translate('final_order_display',{'$orders': orderMessage },state.vars.reg_lang));
    global.promptDigits(orderConfirmationHandler.handlerName);
}
function displayBundles(district){

    var bundleInputs = getBundlesInputs(district);
    state.vars.bundleInputs = JSON.stringify(bundleInputs);
    var unique = [];
    var bundles = [];
    var maizeBanedBundleIds = [];

    // Check for maize bundle in the current's client order
    if(state.vars.orders != ' '){
        var maizeTable = project.initDataTableById(service.vars.maizeEnrollmentTableId);
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
    
    var menu = populateMenu(state.vars.reg_lang,140,bundles);
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
    var table = project.initDataTableById(service.vars.enrollmentBundleTableId);
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

    var menu = populateMenu(state.vars.reg_lang,140,selectedBundle,true);
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

