var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');
var rosterAPI = require('../../rw-legacy/lib/roster/api');
var Enrollment = require('../enrollment/enrollment');

var handlerName = 'bu_pre_enrollment_handler';
module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var getMessage = translator(translations, lang);
            var accountNumber = input && input.replace(/\D/g, '');
            var clientTobeEnrolled = rosterAPI.getClient(accountNumber, project.vars.country);
            if(clientTobeEnrolled) {
                // valid account number. continue to next step (enrollment)
                var groupLeader = JSON.parse(state.vars.client_json); // client_json state variable stores the group leader's accont on initial login
                if(clientTobeEnrolled.GroupId && groupLeader.GroupId != clientTobeEnrolled.GroupId) {
                    // the client is a returning client and has no match on group code with group leader
                    // terminate
                    global.sayText(getMessage('not_in_the_same_group', {}, lang) + getMessage('account_to_be_enrolled',{}, lang));
                    global.promptDigits(handlerName);
                } else {
                    /* new client. since the client is either new (with no group), 
                        or a returning with matching group, start enrollment
                        */
                    if(!clientTobeEnrolled.GroupId) {
                        // if the farmer is new, assign them their group leaders groupId
                        clientTobeEnrolled.GroupId = groupLeader.GroupId;
                    }
                    Enrollment.start(lang, clientTobeEnrolled);
                }
            } else {
                // error client not found. reprompt
                // invalid account number. reprompt for account number
                global.sayText(getMessage('account_to_be_enrolled', {}, lang));
                global.promptDigits(handlerName);
            }
        };
    }
};
