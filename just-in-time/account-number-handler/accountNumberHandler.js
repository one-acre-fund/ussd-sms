var handlerName = 'account_number_handler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var rosterAPI = require('../../rw-legacy/lib/roster/api');
var translate =  createTranslator(translations, project.vars.lang);


var isInTheSameGroup = function(accountNumber) {
    var clientJSON = rosterAPI.getClient(accountNumber,state.vars.country);
    if(clientJSON){
        state.vars.topUpClient = JSON.stringify(clientJSON);
        var groupId = clientJSON.GroupId;
        if(JSON.parse(state.vars.client_json).GroupId == groupId){
            return true;
        }
        return false;
    }
};
module.exports = {
    handlerName: handlerName,
    getHandler: function(onAccountNumberValidated){
        return function (input) {
            notifyELK();
            if(isInTheSameGroup(input)){
                onAccountNumberValidated();
            }
            else{
                global.sayText(translate('account_number_handler',{},state.vars.jitLang));
                global.promptDigits(handlerName);
            }
        };
    }
};