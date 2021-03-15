var enrollment = require('../../enrollment/enrollment');
var getClient = require('../../../shared/rosterApi/getClient');

var handlerName = 'bu_reg_continue_to_ordering';

module.exports = {
    handlerName: handlerName,
    getHandler: function(language) {
        return function(input) {
            if(input === '1') {
                // trigger ordering
                var registeredClientAccount = state.vars.registered_client_account;
                var groupLeader = JSON.parse(state.vars.client_json);
                var registeredClient = getClient(registeredClientAccount, 'BI');
                if(registeredClientAccount && registeredClient.GroupId == groupLeader.GroupId) {
                    enrollment.start(language, registeredClient);
                    return;
                }
                global.stopRules();
            } else if(input === '0') {
                global.stopRules();
            }
        };
    }
};
