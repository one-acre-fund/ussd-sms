var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

module.exports = function regionHandler(input) {
    var lang = state.vars.lang || 'en';
    state.vars.lang = lang;
    var getMessage = translator(translations, lang);
    var dukaCountiesTable = project.getOrCreateDataTable('Duka_locator_counties');
    var countiesEntries = dukaCountiesTable.queryRows({vars: {region_id: input.replace(/\D/g, '')}});
    var counties = '';
    if(countiesEntries.hasNext()) {
        var labeledCounties = {};
        var label = {value: 1};
        while(countiesEntries.hasNext()) {
            var record = countiesEntries.next().vars;
            labeledCounties[label.value] = record.countie_id;
            counties = counties + String(label.value) + ') ' + record.countie_name + '\n';
            label.value = label.value + 1;
        }

        state.vars.labeled_counties = JSON.stringify(labeledCounties);
        state.vars.duka_current_menu = getMessage('select_oaf_duka_county', {'$Menu': counties}, lang);
        sayText(state.vars.duka_current_menu);
        promptDigits('select_oaf_duka_county', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        });
    } else if(input == state.vars.not_listed_option) {
        sayText(getMessage('supported_locations', {'$Locations': JSON.parse(state.vars.all_regions).join(', ')}, lang));
        stopRules();
    } else {
        sayText(getMessage('invalid_input', {'$Menu': state.vars.duka_current_menu}, lang));
        promptDigits('select_oaf_duka_region', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        });
    }
};
