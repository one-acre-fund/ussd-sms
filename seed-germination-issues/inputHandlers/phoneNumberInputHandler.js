var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');

var handlerName = 'rsgi_phone';
module.exports = {
    handlerName: handlerName,
    getHandler: function(lang, seed_germination_issues_table) {
        return function(input) {
            if(input) {
                // store the collected info into the seed germination issues
                var table = project.getOrCreateDataTable(seed_germination_issues_table);
                var row = table.createRow({vars: {
                    'duka': state.vars.chosen_duka,
                    'lot_code': state.vars.lot_code,
                    'month': state.vars.chosen_month,
                    'phone': input,
                    'seed_brand': state.vars.rsgi_seed_brand,
                    'seed_variety': state.vars.rsgi_seed_variety,
                    'week': state.vars.week_number,
                }});
                row.save();
                global.stopRules();
            } else {
                // empty input
                var getMessage = translator(translations, lang);
                var phonePrompt = getMessage('phone_prompt', {}, lang);
                global.sayText(phonePrompt);
                global.promptDigits(handlerName);
            }
        };
    }
};
