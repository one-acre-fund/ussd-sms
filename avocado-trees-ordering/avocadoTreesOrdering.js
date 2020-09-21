var translations = require('./translations');
var createTranslator = require('../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.cor_lang);
var notifyELK = require('../notifications/elk-notification/elkNotification');
var avocadoEligibility = require('./avocado-eligibility/avocadoEligibility');
var placeOrderHandler = require('./place-order-handler/placeOrderHandler');
var confirmOrderHandler = require('./confirm-order-handler/confirmOrderHandler');
var enrollOrder = require('../Roster-endpoints/enrollOrder');
module.exports = {
    registerHandlers: function (){
        addInputHandler(placeOrderHandler.handlerName, placeOrderHandler.getHandler(onOrderPlaced));
        addInputHandler(confirmOrderHandler.handlerName, confirmOrderHandler.getHandler(onOrderConfirmed));

    },
    start: function (account, country, lang) {
        notifyELK();
        state.vars.account = account;
        state.vars.country = country;
        state.vars.lang = lang;

        var avocado_table = project.initDataTableById(service.vars.avocado_table_id);
        var possibleTrees = avocadoEligibility(avocado_table, state.vars.account,JSON.parse(state.vars.client_json));
        state.vars.possibleTrees = JSON.stringify(possibleTrees);
        
        if(possibleTrees){
            if(possibleTrees.possibleTrees > 3){
                global.sayText(translate('eligible_repayment_message',{'$amount': possibleTrees.balance,'$number': possibleTrees.possibleTrees},state.vars.lang));
                global.promptDigits(placeOrderHandler.handlerName);
            } 
        }
    }
};

function onOrderPlaced(input){
    global.sayText(translate('confirm_order',{'$number': input}, state.vars.lang));
    state.vars.orderedNumber = input;
    global.promptDigits(confirmOrderHandler.handlerName);
}

function onOrderConfirmed(){

    //enroll order
    var requestBundles = {
        'bundleId': '-2983',
        'bundleQuantity': state.vars.orderedNumber,
        'inputChoices': [-12625]
    };
    var client = JSON.parse(state.vars.client_json);
    var groupId = client.GroupId;
    if(groupId == null){
        var table = project.initDataTableById(service.vars.rw_reg_client_table_id);
        var cursor = table.queryRows({'vars': {'account_number': client.AccountNumber}});
        if(cursor.hasNext()){
            var row = cursor.next();
            groupId = row.vars.groupId;
        }
        else{
            global.sayText(translate('order_not_finalized',{},state.vars.lang));
            global.stopRules();
        }
    }
    var requestData = {
        'districtId': client.DistrictId,
        'siteId': client.SiteId,
        'groupId': groupId,
        'accountNumber': client.AccountNumber,
        'clientId': client.ClientId,
        'isGroupLeader': 'false',
        'clientBundles': requestBundles
    };
    if(enrollOrder(requestData)){
        var avocado_table = project.initDataTableById(service.vars.avocado_table_id);
        var avocadoCursor = avocado_table.queryRows({'vars': {'account_number': client.AccountNumber}});
        if(avocadoCursor.hasNext()){
            var avocadoRow = avocadoCursor.next();
            avocadoRow.vars.a_avokaqty = state.vars.orderedNumber;

        }
        var message = translate('final_message',{'$number': state.vars.orderedNumber},state.vars.lang);
        global.sayText(message);
        var msg_route = project.vars.sms_push_route;
        project.sendMessage({ 'to_number': contact.phone_number, 'route_id': msg_route, 'content': message }); 
    }
    else{
        global.sayText(translate('order_not_finalized',{},state.vars.lang));
    }
    
}