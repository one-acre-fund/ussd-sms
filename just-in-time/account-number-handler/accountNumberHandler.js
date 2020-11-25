var handlerName = 'account_number_handler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var rosterAPI = require('../../rw-legacy/lib/roster/api');
var translate =  createTranslator(translations, project.vars.lang);

var TrimClientJSON = function(client){
    var SeasonCount = client.BalanceHistory.length;
    if (SeasonCount>3){client.BalanceHistory.length = 3;}
    return client;
};

var isInTheSameGroup = function() { 
    var clientJSON = JSON.parse(state.vars.topUpClient);
    if(clientJSON){
        var groupId = clientJSON.GroupId;
        if(JSON.parse(state.vars.client_json).GroupId == groupId){
            return true;
        }
    }
    return false;
};
var isValid = function(accountNumber){
    if(rosterAPI.authClient(accountNumber,'KE')){
        var client = rosterAPI.getClient(accountNumber,state.vars.country);
        if(client){
            state.vars.topUpClient = JSON.stringify(TrimClientJSON(client));
            if(client.BalanceHistory.length > 0){
                if(client.BalanceHistory[0].SeasonName == '2021, Long Rain'){
                    return true;
                }
            }
        }
    }
    return false;
};
var hasAlreadyTopedUp = function(accounNumber){
    var table = project.initDataTableById(service.vars.JiTEnrollmentTableId);
    var cursor = table.queryRows({vars: {'account_number': accounNumber}});
    if(cursor.hasNext()){
        return true;
    }
    return false;
};
var enrolledThroughJustInTime = function(accountNumber){
    var table = project.initDataTableById(service.vars.JITSucessfullRegId);
    var cursor = table.queryRows({vars: {'account_number': accountNumber}}); 
    if(cursor.hasNext()){
        return true;
    }
    return false;
};
module.exports = {
    handlerName: handlerName,
    getHandler: function(onAccountNumberValidated){
        return function (input) {
            notifyELK();
            if(hasAlreadyTopedUp(input)){
                global.sayText(translate('already_placed_order',{},state.vars.jitLang));
                global.stopRules();
            }
            else if(enrolledThroughJustInTime(input)){
                global.sayText(translate('jit_client',{},state.vars.jitLang));
                global.stopRules();
            }
            else if(!isValid(input)){
                global.sayText(translate('not_enrolled',{},state.vars.jitLang));
                global.stopRules();
            }
            else if(isInTheSameGroup()){
                var client = JSON.parse(state.vars.topUpClient);
                var paid = 0;
                if(client.BalanceHistory.length > 0)
                    paid = client.BalanceHistory[0].TotalRepayment_IncludingOverpayments;
                if(paid < 500)
                {
                    global.sayText(translate('remaining_balance',{'$amount': (500-paid)},state.vars.jitLang));
                    global.stopRules();
                }
                else{
                    onAccountNumberValidated();
                }
            }
            else{
                global.sayText(translate('account_number_handler',{},state.vars.jitLang));
                global.promptDigits(handlerName);
            }
        };
    }
};