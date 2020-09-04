var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var seasonHandler = require('./seasonHandler');

var maizeResponseHandlerName = 'maize_bags';
module.exports = {
    handlerName: maizeResponseHandlerName,
    getHandler: function(lang, maize_recommendation_table) {
        return function() {
            var getMessage = translator(translations, lang);
            var maizeBags = content.trim().toUpperCase();
            var low_productivity;
            if(maizeBags == 'A') {
                var table = project.getOrCreateDataTable(maize_recommendation_table);
                var row = table.queryRows({
                    vars: {
                        district: state.vars.district
                    }
                });
                if(row.hasNext()) {
                    var record = row.next();
                    low_productivity = record.vars.low_productivity;
                    sendReply(low_productivity);
                }
            } else if(maizeBags == 'B' || maizeBags == 'C') {
                state.vars.bags = maizeBags;
                var maize_title = getMessage('maize_plant_prompt_title', {}, lang);
                var options = getMessage('time_planted', {}, lang);
                var message = maize_title + options;
                state.vars.bags_message = message;
                sendReply(message);
                waitForResponse(seasonHandler.handlerName);
            } else {
                sendReply(state.vars.acres_message);
                waitForResponse(maizeResponseHandlerName);
            }
        };
    }
};
