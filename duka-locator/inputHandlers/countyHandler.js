var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
module.exports = function countyHandler(input) {
    notifyELK();
    var lang = state.vars.lang || 'en';
    state.vars.lang = lang;
    var labeled_counties = JSON.parse(state.vars.labeled_counties);
    var getMessage = translator(translations, lang);
    var countie_id = labeled_counties[input.replace(/\D/g, '')];
    var dukas = '';
    if(countie_id) {
        var dukasTable = project.getOrCreateDataTable('Duka_locator_dukas');
        var dukasTableEntries = dukasTable.queryRows({vars: {countie_id: countie_id}});
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
    } else if(input == 77 && state.vars.multiple_countie_screens && state.vars.current_countie_screen + 1 < JSON.parse(state.vars.multiple_countie_screens).length){
        state.vars.current_countie_screen = state.vars.current_countie_screen + 1;
        var countie_screens = JSON.parse(state.vars.multiple_countie_screens);
        var menu = countie_screens[state.vars.current_countie_screen];
        var next = (state.vars.current_countie_screen + 1 < countie_screens.length) ? getMessage('next_page', {}, lang) : '';
        state.vars.duka_current_menu = menu + next;
        sayText(state.vars.duka_current_menu);
        promptDigits('select_oaf_duka_county', {
            submitOnHash: false,
            maxDigits: 2,
            timeout: 5
        });
    } else { 
        var counties = JSON.parse(state.vars.filtered_counties).join(', ');
        sayText(getMessage('supported_locations', {'$Locations': counties}, lang));
        stopRules();
    }
};
