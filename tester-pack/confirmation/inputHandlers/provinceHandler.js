var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var locationsMenu = require('../utils/createLocationMenu');

module.exports = function provinceHandler(input) {
    var lang = state.vars.lang || 'en';
    state.vars.lang = lang;
    var getMessage = translator(translations, lang);
    var provinces = JSON.parse(state.vars.provinces);
    var province = provinces[input];
    if(province) {
        state.vars.selected_province = province;
        var districts = {};
        var village_table = project.getOrCreateDataTable('VillageInfo');
        var village_cursor = village_table.queryRows({vars: {'provence': province}});
        while(village_cursor.hasNext()) {
            var row = village_cursor.next();
            if(!districts[row.vars.district]) {
                districts[row.vars.district] = row.vars.district;
            }
        }
        var message = getMessage('districts_title', {}, lang);
        var all_locations = locationsMenu(districts, message, lang);
        state.vars.districts_screens = JSON.stringify(all_locations.all_screens);
        state.vars.current_districts_screen = 1;
        state.vars.districts = JSON.stringify(all_locations.stored_locations);
        sayText(all_locations.all_screens[1]);
        promptDigits('select_district', {
            timeout: 5,
            maxDigits: 2,
            submitOnHash: false
        });
    }
};
