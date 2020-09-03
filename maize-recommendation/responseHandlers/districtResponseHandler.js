var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

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
            if(row.hasNext()) {
                var record = row.next();
                state.vars.district = record.vars.district;
                var acres_title = getMessage('acres_title', {}, lang);
                var acres_options = getMessage('acres_options', {}, lang);
                var acres_message = acres_title + acres_options;
                sendReply(acres_message);
                waitForResponse('acres');
            } else {
                var promptDistrict = getMessage('invalid_district', {}, lang);
                sendReply(promptDistrict);
            }
        };
    }
};
