var enrollment = require('../../enrollment/enrollment');
var getClient = require('../../../shared/rosterApi/getClient');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');

var handlerName = 'bu_reg_continue_to_ordering';

module.exports = {
    handlerName: handlerName,
    getHandler: function(language) {
        return function(input) {
            notifyELK();
            if(input === '1') {
                // trigger ordering
                var registeredClientAccount = state.vars.registered_client_account;
                var groupLeader = JSON.parse(state.vars.client_json);
                var registeredClient = getClient(registeredClientAccount, 'BI');
                // add the groupId of a group leader to the newly registered client since they have no group before enrollment
                registeredClient.GroupId = groupLeader.GroupId;
                enrollment.start(language, registeredClient);
            } else if(input === '0') {
                global.stopRules();
            }
        };
    }
};
