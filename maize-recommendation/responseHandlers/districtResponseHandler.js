var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var acresResponseHandler = require('./acresResponseHandler');

var districtResponseHandlerName = 'district';
module.exports = {
    handlerName: districtResponseHandlerName,
    getHandler: function(lang, maize_recommendation_table) {
        return function() {
            var getMessage = translator(translations, lang);
            var district = content.trim();
            var table = project.getOrCreateDataTable(maize_recommendation_table);
            var row = table.queryRows({
                vars: {
                    district: district
                }
            });
            console.log('reaching 1 ===> ', maize_recommendation_table);
            if(row.hasNext()) {
                var record = row.next();
                state.vars.district = record.vars.district;
                var acres_title = getMessage('acres_title', {}, lang);
                var acres_options = getMessage('acres_options', {}, lang);
                console.log('reaching 2 ===> ', acres_message);
                var acres_message = acres_title + acres_options;
                sendReply(acres_message);
                state.vars.acres_message = acres_message;
                waitForResponse(acresResponseHandler.handlerName);
            } else {
                var promptDistrict = getMessage('invalid_district', {}, lang);
                console.log('reaching 3 ===> ', promptDistrict);
                sendReply(promptDistrict);
            }
        };
    }
};
