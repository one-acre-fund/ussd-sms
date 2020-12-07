var getFOInfo = require('../Roster-endpoints/Fo-info/getFoInfo');
var translator = require('../utils/translator/translator');
var notifyELK = require('../notifications/elk-notification/elkNotification');
var translations = require('./translations');

module.exports = {
    start: function (lang) {
        notifyELK();
        var client = JSON.parse(state.vars.client);
        var foDetails = getFOInfo(client.DistrictId, client.SiteId, lang);
        if (foDetails) {
            var getMessage = translator(translations, lang);
            var message = getMessage('fo_details_message', {
                '$name': foDetails.firstName + ' ' + foDetails.lastName,
                '$number': foDetails.phoneNumber
            });
            global.sayText(message);
        }
    },
};
