var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');
var getClient = require('../../shared/rosterApi/getClient');
var Enrollment = require('../enrollment/enrollment');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var reduceClientSize = require('../../shared/reduceClientSize');

var handlerName = 'bu_pre_enrollment_handler';

/*function getNewClientInfoFromTable(accountNumber){
    var table = project.initDataTableById(service.vars.client_table_id);
    var cursor = table.queryRows({vars: {accountNumber: accountNumber}});
    if(cursor.hasNext()){
        var row = cursor.next();
        var clientInfo = {
            districtId: row.vars.district_id,
            siteId: row.vars.site_id,
            groupId: row.vars.group_id
        };
        return clientInfo;
    }
    return false;
}*/
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
                console.log(state.vars.sameGroup);
                console.log('finally here');
                if(state.vars.sameGroup == 'true') {
                    if((clientTobeEnrolled.DistrictID == groupLeader.DistrictID) && (clientTobeEnrolled.SiteID == groupLeader.SiteID)){
                        console.log('Client IDS:'+JSON.stringify(clientTobeEnrolled) );
                        console.log('GL:'+ JSON.stringify(groupLeader));
                        clientTobeEnrolled.groupId = groupLeader.groupId;
                        var reducedClient = reduceClientSize(clientTobeEnrolled);
                        Enrollment.start(lang, reducedClient);
                    }
                    else {
                        // The farmer  you are trying to enroll is registered in a different site 
                        global.sayText(getMessage('different_geo'));
                        return;
                    }

                }
                else {

                    var groupInfo = JSON.parse(state.vars.group_info);
                    if((clientTobeEnrolled.DistrictID == groupInfo.districtID) && (clientTobeEnrolled.SiteID == groupInfo.siteID)) {
                        clientTobeEnrolled.groupId = groupInfo.groupId;
                        reducedClient = reduceClientSize(clientTobeEnrolled);
                        Enrollment.start(lang, reducedClient);
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
