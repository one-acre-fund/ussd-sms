var changeGroupNameApi = require('../../shared/rosterApi/changeGroupNameApi');
var handlerName = 'change_group_name_handler';
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var getMessage = translator(translations, lang);
            var groupName = input && input.trim();
            var client = JSON.parse(state.vars.client_changing_group);
            if(groupName) {
                // make call
                var group = changeGroupNameApi({
                    'districtId': client.DistrictId,
                    'groupId': client.GroupId,
                    'clientId': client.ClientId,
                    'groupName': groupName
                });
                if(!group) {
                    // failed
                    global.sayText(getMessage('group_not_changed', {}, lang));
                    global.stopRules();
                } else {
                    // successfull
                    global.sayText(getMessage('group_changed', {'$group': groupName}, lang));
                    global.stopRules();
                }
            } else {
                // reprompt
                global.sayText(getMessage('enter_group_name', {}, lang));
                global.promptDigits(handlerName);
            }
        };
    }
};
