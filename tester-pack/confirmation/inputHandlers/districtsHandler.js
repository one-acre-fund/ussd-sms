var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var locationsMenu = require('../utils/createLocationMenu');

module.exports = function districtHandler(input) {
    var lang = state.vars.lang;
    state.vars.lang = lang;
    var getMessage = translator(translations, lang);
    var districts = JSON.parse(state.vars.districts);
    var district = districts[input];
    var districts_screens = JSON.parse(state.vars.districts_screens);
    var current_districts_screen = state.vars.current_districts_screen;
    if(district) {
        state.vars.selected_district = district;
        var sectors = {};
        var village_table = project.getOrCreateDataTable('VillageInfo');
        var village_cursor = village_table.queryRows({vars: {'provence': state.vars.selected_province, 'district': district}});
        while(village_cursor.hasNext()) {
            var row = village_cursor.next();
            sectors[row.vars.sector] = row.vars.sector;
        }
        var message = getMessage('sector_title', {}, lang);
        var all_locations = locationsMenu(sectors, message, lang);

        state.vars.sectors_screens = JSON.stringify(all_locations.all_screens);
        state.vars.current_sectors_screen = 1;

        state.vars.sectors = JSON.stringify(all_locations.stored_locations);
        sayText(all_locations.all_screens[state.vars.current_sectors_screen]);
        promptDigits('select_sector', {
            timeout: 5,
            maxDigits: 2,
            submitOnHash: false
        });
    } else if(input == 77 && districts_screens[current_districts_screen +1]) {
        state.vars.current_districts_screen = current_districts_screen + 1;
        sayText(districts_screens[state.vars.current_districts_screen]);
        promptDigits('select_district', {
            timeout: 5,
            maxDigits: 2,
            submitOnHash: false
        });
    } else {
        sayText(getMessage('invalid_input', {'$Menu': districts_screens[current_districts_screen]}, lang));
        promptDigits('select_district', {
            timeout: 5,
            maxDigits: 2,
            submitOnHash: false
        });
    }
};
