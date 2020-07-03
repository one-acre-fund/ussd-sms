var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var adminLogger = require('../../rw-legacy/lib/admin-alert');

module.exports = function countyHandler(input) {
    var lang = state.vars.lang || 'en';
    state.vars.lang = lang;
    var labeled_counties = JSON.parse(state.vars.labeled_counties);
    var getMessage = translator(translations, lang);
    var dukasTable = project.getOrCreateDataTable('Duka_locator_dukas');
    var countie_id = labeled_counties[input.replace(/\D/g, '')];
    var dukasTableEntries = dukasTable.queryRows({vars: {countie_id: countie_id}});
    var dukas = '';
    if(dukasTableEntries.hasNext()) {
        var labeledDukas = {};
        var label = {value: 1};
        while(dukasTableEntries.hasNext()) {
            var record = dukasTableEntries.next().vars;
            labeledDukas[label.value] = record.duka_id;
            dukas = dukas + String(label.value) + ') ' + record.duka_name + '\n';
            label.value = label.value + 1;
        }

        state.vars.labeled_dukas = JSON.stringify(labeledDukas);
        state.vars.duka_current_menu = getMessage('select_oaf_duka', {'$Menu': dukas}, lang);
        sayText( state.vars.duka_current_menu);
        promptDigits('select_oaf_duka', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        });
    } else { 
        sayText(getMessage('invalid_input', {'$Menu': state.vars.duka_current_menu}, lang));
        promptDigits('select_oaf_duka_county', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        });
    }
};
