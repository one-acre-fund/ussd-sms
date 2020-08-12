var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
module.exports = function dukaHandler(input) {
    notifyELK();
    var lang = state.vars.lang || 'en';
    state.vars.lang = lang;
    var getMessage = translator(translations, lang);
    var labeled_dukas = JSON.parse(state.vars.labeled_dukas);
    var dukasTable = project.getOrCreateDataTable('Duka_locator_dukas');
    var duka_id = labeled_dukas[input.replace(/\D/g, '')];
    var dukasTableEntries = dukasTable.queryRows({vars: {duka_id: duka_id}});
    if(dukasTableEntries.hasNext()) {
        var record = dukasTableEntries.next().vars;
        state.vars.selected_duka = JSON.stringify(record);
        var dukaLocation = record[lang];
        state.vars.duka_options = JSON.stringify({reach_out_to_agent: 1, exit_menu: 2});
        var menu = getMessage('reach_out_to_agent', {'$label': 1}, lang) + getMessage('exit_menu', {'$label': 2}, lang);
        sayText(dukaLocation + '\n' + menu);
        promptDigits('reach_out_to_agent', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        });
    } else {
        sayText(getMessage('invalid_input', {'$Menu': state.vars.duka_current_menu}, lang));
        promptDigits('select_oaf_duka', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        });
    }
};
