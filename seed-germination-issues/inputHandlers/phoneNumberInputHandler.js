var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');

var handlerName = 'rsgi_phone';
module.exports = {
    handlerName: handlerName,
    getHandler: function(lang, seed_germination_issues_table) {
        return function(input) {
            var getMessage = translator(translations, lang);
            if(input) {
                // store the collected info into the seed germination issues
                var table = project.getOrCreateDataTable(seed_germination_issues_table);
                var row = table.createRow({vars: {
                    'duka': state.vars.chosen_duka,
                    'lot_code': state.vars.lot_code,
                    'purchase_month': state.vars.chosen_month,
                    'phone': input,
                    'seed_variety': state.vars.rsgi_seed_variety,
                    'planting_date': state.vars.planting_date,
                    'issue_severity': state.vars.issues_severity
                }});
                global.sayText(getMessage('callback_screen', {}, lang));
                row.save();
                global.stopRules();
            } else {
                // empty input
                var phonePrompt = getMessage('phone_prompt', {}, lang);
                global.sayText(phonePrompt);
                global.promptDigits(handlerName);
            }
        };
    }
};
