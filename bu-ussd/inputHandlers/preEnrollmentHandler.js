var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');
var getClient = require('../../shared/rosterApi/getClient');
var Enrollment = require('../enrollment/enrollment');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var reduceClientSize = require('../../shared/reduceClientSize');

var handlerName = 'bu_pre_enrollment_handler';
module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            notifyELK();
            var getMessage = translator(translations, lang);
            var accountNumber = input && input.replace(/\D/g, '');
            var clientTobeEnrolled = getClient(accountNumber, project.vars.country);
            if(clientTobeEnrolled) {
                var groupLeader = JSON.parse(state.vars.client_json); // client_json state variable stores the group leader's accont on initial login
                if(state.vars.sameGroup == 'true') {
                    if((clientTobeEnrolled.DistrictId == groupLeader.DistrictId) && (clientTobeEnrolled.SiteId == groupLeader.SiteId)){
                        if(clientTobeEnrolled.GroupId == null || clientTobeEnrolled.GroupId == groupLeader.GroupId){
                            clientTobeEnrolled.GroupId = groupLeader.GroupId;
                            var reducedClient = reduceClientSize(clientTobeEnrolled);
                            Enrollment.start(lang, reducedClient);
                        }
                        else {
                            // The farmer  you are trying to enroll is registered in a different group 
                            global.sayText(getMessage('different_geo'));
                            return;
                        }
                    }
                    else {
                        // The farmer  you are trying to enroll is registered in a different site 
                        global.sayText(getMessage('different_geo'));
                        return;
                    }
                }
                else {

                    var groupInfo = JSON.parse(state.vars.group_info);
                    if((clientTobeEnrolled.DistrictId == groupInfo.districtId) && (clientTobeEnrolled.SiteId == groupInfo.siteId)) {
                        if(clientTobeEnrolled.GroupId == null || clientTobeEnrolled.GroupId == groupInfo.groupId){
                            clientTobeEnrolled.GroupId = groupInfo.groupId;
                            reducedClient = reduceClientSize(clientTobeEnrolled);
                            Enrollment.start(lang, reducedClient);
                        }
                        else {
                            global.sayText(getMessage('different_geo_code'));
                            return;
                        }
                    }
                    else {
                        global.sayText(getMessage('different_geo_code'));
                        return;
                    }

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
