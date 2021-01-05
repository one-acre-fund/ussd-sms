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
var groupCodeHandler = require('./group-code-handler/groupCodeHandler');
var continueHandler = require('./continue/continue');
var enrollOrder = require('../Roster-endpoints/enrollOrder');
var getPhoneNumber = require('../shared/rosterApi/getPhoneNumber');
module.exports = {
    registerHandlers: function (){
        
        function onNationalIdValidated(nationalId){
            var table;
            if(state.vars.country == 'RW'){
                table = project.initDataTableById(service.vars.rw_reg_client_table_id);
            }
            else{
                table = project.initDataTableById(service.vars.lr_2021_client_table_id);
            }
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
        function onContinueToEnroll(){
            displayBundles(JSON.parse(state.vars.newClient).DistrictId); 
            global.promptDigits(bundleChoiceHandler.handlerName);
    
        }
        function onPhoneNumberConfirmed(){
            if(state.vars.country == 'RW'){
                global.sayText(translate('enter_group_code',{},state.vars.reg_lang));
                global.promptDigits(groupCodeHandler.handlerName);
            }
            else{
                if(state.vars.canEnroll){
                    //display bundles
                    saveClientInRoster();
                }
                else{
                    global.sayText(translate('reg_group_leader_question',{},state.vars.reg_lang));
                    global.promptDigits(groupLeaderQuestionHander.handlerName);
                }
            }
        }
        function onGroupCodeValidated(groupInfo){
            var clientJSON = {
                'districtId': groupInfo.districtId,
                'siteId': groupInfo.siteId,
                'groupId': groupInfo.groupId,
                'firstName': state.vars.firstName,
                'lastName': state.vars.lastName,
                'nationalIdNumber': state.vars.nationalId,
                'phoneNumber': state.vars.phoneNumber
            };
            try {
                var clientData = JSON.parse(rosterRegisterClient(clientJSON,state.vars.reg_lang));
                if(clientData){
                    var message = translate('enr_reg_complete',{'$ACCOUNT_NUMBER': clientData.AccountNumber},state.vars.reg_lang);
                    var msg_route = project.vars.sms_push_route;
                    sayText(message);
                    project.sendMessage({ 'to_number': clientJSON.phoneNumber, 'route_id': msg_route, 'content': message });
                    project.sendMessage({ 'to_number': contact.phone_number, 'route_id': msg_route, 'content': message });
                    var table = project.initDataTableById(service.vars.rw_reg_client_table_id);
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
                            'registering_phone_number': contact.phone_number,
                            'groupId': clientJSON.groupId,
                        }
                    });
                    row.save();
                }
            }catch (e){
                console.log('error getting account number from roster' + e);
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
        addInputHandler(bundleChoiceHandler.handlerName, bundleChoiceHandler.getHandler(onBundleSelected,displayBundles));
        addInputHandler(varietyChoiceHandler.handlerName, varietyChoiceHandler.getHandler(onVarietyChosen));
        addInputHandler(orderConfirmationHandler.handlerName, orderConfirmationHandler.getHandler(onOrderConfirmed,displayBundles));
        addInputHandler(addOrderHandler.handlerName, addOrderHandler.getHandler(onFinalizeOrder,displayBundles));
        addInputHandler(varietyConfirmationHandler.handlerName, varietyConfirmationHandler.getHandler(onBundleSelected,displayBundles));
        addInputHandler(groupCodeHandler.handlerName, groupCodeHandler.getHandler(onGroupCodeValidated));
        addInputHandler(continueHandler.handlerName, continueHandler.getHandler(onContinueToEnroll));
    },
    onContinueToEnroll: function(){
        displayBundles(JSON.parse(state.vars.newClient).DistrictId); 
        global.promptDigits(bundleChoiceHandler.handlerName);
    },

    start: function (account, country,lang) {
        notifyELK();
        state.vars.account = account;
        state.vars.country = country;
        state.vars.reg_lang = lang;
        state.vars.orders = ' ';
        state.vars.chosenMaizeBundle = ' ';
        state.vars.varietyWarehouse = ' ';
        state.vars.chosenVariety = ' ';
        global.sayText(translate('national_id_handler',{},state.vars.reg_lang));
        global.promptDigits(nationalIdHandler.handlerName);
    },
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
            //commenting this because just in time enrollment message don't have a fo phone
            //var getFOInfo = require('../Roster-endpoints/Fo-info/getFoInfo');
            //var foInfo = getFOInfo(clientData.DistrictId,clientData.SiteId,state.vars.reg_lang);
            var message,displayingMessage;
            //if((foInfo == null) || (foInfo.phoneNumber == null || foInfo.phoneNumber == undefined)){
            message = translate('reg_complete_message_no_phone' , {'$ACCOUNT_NUMBER': clientData.AccountNumber}, state.vars.reg_lang);
            displayingMessage = translate('reg_complete_displaying_message_no_phone' , {'$ACCOUNT_NUMBER': clientData.AccountNumber}, state.vars.reg_lang);
            //}
            /*else{
            message = translate('reg_complete_message' , {'$ACCOUNT_NUMBER': clientData.AccountNumber,'$FOphone': foInfo.phoneNumber}, state.vars.reg_lang);
            displayingMessage = translate('reg_complete_displaying_message' , {'$ACCOUNT_NUMBER': clientData.AccountNumber,'$FOphone': foInfo.phoneNumber}, state.vars.reg_lang);
            }*/
            var groupLeaderInterested;
            if(state.vars.canEnroll){
                groupLeaderInterested = '0';
            }
            else {
                groupLeaderInterested = state.vars.groupLeader;
            }
            project.sendMessage({content: message, to_number: contact.phone_number});
            project.sendMessage({content: message, to_number: clientJSON.phoneNumber});
            var table = project.initDataTableById(service.vars.JITSucessfullRegId);
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
                    'district_name': client.DistrictName,
                    'site_name': client.SiteName,
                    'new_client': '1',
                    'gl_interested': groupLeaderInterested,
                    'gl_phone_number': contact.phone_number,
                }
            });
            row.save();
            global.sayText(displayingMessage);
            global.promptDigits(continueHandler.handlerName);
        }
    }
    catch (e) {
        console.log('error getting account number from roster' + e);
    }
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
        var order;
        if(state.vars.chosenMaizeBundle != ' ' && (JSON.parse(state.vars.chosenMaizeBundle).bundleId == bundle[j].bundleId)){
            var chosenBundle = JSON.parse(state.vars.chosenMaizeBundle);
            order = {'bundleId': bundle[j].bundleId, 'bundleQuantity': chosenBundle.quantity, inputChoices: [parseInt(bundle[j].bundleInputId)] };
        }else{
            order = {'bundleId': bundle[j].bundleId, 'bundleQuantity': 1, inputChoices: [parseInt(bundle[j].bundleInputId)] };
        }
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
    var orderPlaced = JSON.parse(state.vars.orders);
    var orderPlacedMessage = '';
    for( var m = 0; m < orderPlaced.length; m++ ){
        if(state.vars.chosenMaizeBundle != ' ' && (JSON.parse(state.vars.chosenMaizeBundle).bundleId == orderPlaced[m].bundleId)){
            var bundlechosen = JSON.parse(state.vars.chosenMaizeBundle);
            orderPlaced[m].bundleName = bundlechosen.bundleName;
            orderPlacedMessage = orderPlacedMessage + bundlechosen.bundleName + ' ' + bundlechosen.price + ' ';
        }
        else{
            orderPlacedMessage = orderPlacedMessage + orderPlaced[m].bundleName + ' ' + orderPlaced[m].price + ' ';
        }
    } 
    if(enrollOrder(requestData)){
        var table = project.initDataTableById(service.vars.JITSucessfullRegId);
        var cursor = table.queryRows({vars: {'account_number': client.AccountNumber}});
        if(cursor.hasNext()){
            var row = cursor.next();
            row.vars.finalized = 1;
            row.vars.orders = JSON.stringify(requestBundles);
            row.save();
        }
        else{
            var newRow = table.createRow({
                'contact_id': contact.id,
                vars: {
                    'account_number': client.AccountNumber,
                    'finalized': 1,
                    'orders': JSON.stringify(requestBundles)
                }});
            newRow.save();
        }
        var message = translate('final_message',{'$products': orderPlacedMessage},state.vars.reg_lang);
        global.sayText(message);
        var bundleStockTable = project.initDataTableById(service.vars.warehouseStockTableId);
        orderPlaced.forEach(function(element){
            var stockCursor = bundleStockTable.queryRows({vars: {'warehousename': state.vars.warehouse,'bundlename': element.bundleName}});
            if(stockCursor.hasNext()){
                console.log('found');
                var row = stockCursor.next();
                row.vars.quantityordered =  row.vars.quantityordered + 1;
                console.log('old quantity:--------------'+row.vars.quantityordered+ 'product:-----------'+element.bundleName+'warehouse:'+state.vars.warehouse+ service.vars.warehouseStockTableId);
                row.save();
            } 
            console.log('old quantity:--------------0'+ 'product:-----------'+element.bundleName+'warehouse:'+state.vars.warehouse+ service.vars.warehouseStockTableId);
        });
        console.log('no found');
        if(state.vars.chosenVariety != ' '){
            var varietyStockTable = project.initDataTableById(service.vars.varietyStockTableId);
            var stockCursor = varietyStockTable.queryRows({vars: {'warehousename': state.vars.varietyWarehouse,'inputname': JSON.parse(state.vars.chosenVariety).inputName}});
            if(stockCursor.hasNext()){
                var vRow = stockCursor.next();
                vRow.vars.quantityordered =  vRow.vars.quantityordered + 1;
                vRow.save();
            }
        }
        project.sendMessage({
            content: message, 
            to_number: contact.phone_number
        });
        if(typeof(state.vars.phoneNumber) === 'undefined'){
            var phone_numbers = getPhoneNumber(client.AccountNumber, client.CountryName);
            if(phone_numbers) {
                var active_phone_numbers = phone_numbers.filter(function(phone_number) {
                    return !phone_number.IsInactive;
                });
                state.vars.phoneNumber = active_phone_numbers[0].PhoneNumber;
            }
        }
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
        if(state.vars.chosenMaizeBundle != ' ' && (JSON.parse(state.vars.chosenMaizeBundle).bundleId == allBundles[j].bundleId)){
            var chosenBundle = JSON.parse(state.vars.chosenMaizeBundle);
            orderMessage = orderMessage + chosenBundle.bundleName + ' ' + chosenBundle.price + '\n';

        }else{
            orderMessage = orderMessage + allBundles[j].bundleName + ' ' + allBundles[j].price + '\n';
        }
    }
    global.sayText(translate('final_order_display',{'$orders': orderMessage },state.vars.reg_lang));
    global.promptDigits(orderConfirmationHandler.handlerName);
}
function bundleExists(bundles,bundleId) {
    for (var o =0; o<bundles.length; o++){
        if(bundles[o].bundleId === bundleId)
            return true;
    }
    return false;
    // return bundles.some(function(bundle) {
    //     return bundle.bundleId === bundleId;
    // }); 
}

function displayBundles(district){

    var bundleInputs = getBundlesInputs(district);
    state.vars.currentDistrict = district;
    var unique = [];
    var bundles = [];
    var maizeBanedBundleIds = [];
    var currentOrder = [];
    var maizeBundleIds = [];
    var firstTime = true;
    var newBundle;
    var maizeTable = project.initDataTableById(service.vars.maizeEnrollmentTableId);
    var maizeCursor = maizeTable.queryRows();

    while(maizeCursor.hasNext()){
        var maizeRow = maizeCursor.next(); 
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
                    //skip what the user ordered
                    if(currentOrder.length != 0){
                        if(!bundleExists(currentOrder,bundleInputs[i].bundleId)){
                            if((maizeBundleIds.indexOf(bundleInputs[i].bundleId) != -1) && firstTime){
                                newBundle = JSON.parse(JSON.stringify(bundleInputs[i]));
                                newBundle.bundleName = '1 Maize Acre';
                                newBundle.price = 8950;
                                newBundle.quantity = 1;
                                bundles.push(newBundle);
                                newBundle = JSON.parse(JSON.stringify(bundleInputs[i]));
                                newBundle.bundleName = '0.75 Maize Acre';
                                newBundle.price = 7190;
                                newBundle.quantity = 0.75;
                                bundles.push(newBundle);
                                newBundle = JSON.parse(JSON.stringify(bundleInputs[i]));
                                newBundle.bundleName = '0.5 Maize Acre';
                                newBundle.price = 4950;
                                newBundle.quantity = 0.5;
                                bundles.push(newBundle);
                                bundleInputs[i].bundleName = '0.25 Maize Acre';
                                bundleInputs[i].price = 2830;
                                bundleInputs[i].quantity = 0.25;
                                firstTime = false;
                            }
                            bundles.push(bundleInputs[i]);
                        }
                    }
                    else{
                        if((maizeBundleIds.indexOf(bundleInputs[i].bundleId) != -1) && firstTime){
                            newBundle = JSON.parse(JSON.stringify(bundleInputs[i]));
                            newBundle.bundleName = '1 Maize Acre';
                            newBundle.price = 8950;
                            newBundle.quantity = 1;
                            bundles.push(newBundle);
                            newBundle = JSON.parse(JSON.stringify(bundleInputs[i]));
                            newBundle.bundleName = '0.75 Maize Acre';
                            newBundle.price = 7190;
                            newBundle.quantity = 0.75;
                            bundles.push(newBundle);
                            newBundle = JSON.parse(JSON.stringify(bundleInputs[i]));
                            newBundle.bundleName = '0.5 Maize Acre';
                            newBundle.price = 4950;
                            newBundle.quantity = 0.5;
                            bundles.push(newBundle);
                            bundleInputs[i].bundleName = '0.25 Maize Acre';
                            bundleInputs[i].price = 2830;
                            bundleInputs[i].quantity = 0.25;
                            firstTime = false;
                        }
                        bundles.push(bundleInputs[i]);
                    }
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

