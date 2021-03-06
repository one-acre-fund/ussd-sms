var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var acresResponseHandler = require('./acresResponseHandler');

var districtResponseHandlerName = 'maize_rec_district';
module.exports = {
    handlerName: districtResponseHandlerName,
    getHandler: function(lang, maize_recommendation_table) {
        return function() {
            var getMessage = translator(translations, lang);
            var input = content || '';
            var district = input.trim();
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
                global.sendReply(acres_message);
                state.vars.acres_message = acres_message;
                global.waitForResponse(acresResponseHandler.handlerName);
            } else {
                var promptDistrict = getMessage('invalid_district', {}, lang);
                global.sendReply(promptDistrict);
            }
        };
    }
};
