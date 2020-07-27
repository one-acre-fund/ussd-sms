var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var locationsMenu = require('../utils/createLocationMenu');

module.exports = function cellHandler(input) {
    var lang = state.vars.lang || 'en';
    state.vars.lang = lang;
    var getMessage = translator(translations, lang);
    var cells = JSON.parse(state.vars.cells);
    var cell = cells[input];
    var cells_screens = JSON.parse(state.vars.cells_screens);
    var current_cells_screen = state.vars.current_cells_screen;
    if(cell) {
        state.vars.selected_cell = cell;
        var villages = {};
        var village_table = project.getOrCreateDataTable('VillageInfo');
        var village_cursor = village_table.queryRows({vars: 
            {
                'provence': state.vars.provence, 
                'district': state.vars.selected_district,
                'sector': state.vars.selected_sector,
                'cell': state.vars.selected_Cell
            }});
        while(village_cursor.hasNext()) {
            var row = village_cursor.next();
            if(!villages[row.vars.village]) {
                var villageid = row.vars.villageid;
                var villageName = row.vars.village;
                villages[row.vars.village] = {village_id: villageid, village_name: villageName};
            }
        }

        var message = getMessage('village_title', {}, lang);
        var all_locations = locationsMenu(villages, message, lang);
        state.vars.villages = JSON.stringify(all_locations.stored_locations);
        state.vars.current_villages_screen = 1;
        state.vars.villages_screen = JSON.stringify(all_locations.all_screens);
        sayText(all_locations.all_screens[state.vars.current_villages_screen]);
        promptDigits('select_village', {
            timeout: 5,
            maxDigits: 2,
            submitOnHash: false
        });
    } else if(input === '*' && cells_screens[current_cells_screen + 1]) {
        state.vars.current_cells_screen = current_cells_screen + 1;
        sayText(cells_screens[state.vars.current_cells_screen]);
        promptDigits('select_cell', {
            timeout: 5,
            maxDigits: 2,
            submitOnHash: false
        });
    }
};
