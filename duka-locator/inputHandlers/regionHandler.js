var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
module.exports = function regionHandler(input) {
    notifyELK();
    var lang = state.vars.lang || 'en';
    state.vars.lang = lang;
    var getMessage = translator(translations, lang);
    var dukaCountiesTable = project.getOrCreateDataTable('Duka_locator_counties');
    var countiesEntries = dukaCountiesTable.queryRows({vars: {region_id: input.replace(/\D/g, '')}});
    var counties = '';
    if(countiesEntries.hasNext()) {
        var labeledCounties = {};
        var label = {value: 1};
        var recordsCounter = 1;
        var multiple_screens = [];
        var filtered_counties = [];
        while(countiesEntries.hasNext()) {
            var record = countiesEntries.next().vars;
            labeledCounties[label.value] = record.countie_id;
            counties = counties + String(label.value) + ') ' + record.countie_name + '\n';
            filtered_counties.push(record.countie_name);
            if(recordsCounter > 4) {
                multiple_screens.push(counties);
                counties = '';
                recordsCounter = 1;
            } else if(multiple_screens.length > 0 && !countiesEntries.hasNext()) {
                multiple_screens.push(counties);
            }
            recordsCounter = recordsCounter + 1;
            label.value = label.value + 1;
        }

        state.vars.filtered_counties = JSON.stringify(filtered_counties);

        if(multiple_screens.length > 0) {
            state.vars.multiple_countie_screens = JSON.stringify(multiple_screens);
            counties = multiple_screens[0];
            state.vars.current_countie_screen = 0;
        }
        state.vars.labeled_counties = JSON.stringify(labeledCounties);
        state.vars.duka_current_menu = getMessage('select_oaf_duka_county', {'$Menu': counties}, lang) + (multiple_screens.length > 1 ? getMessage('next_page', {}, lang) : '');
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
