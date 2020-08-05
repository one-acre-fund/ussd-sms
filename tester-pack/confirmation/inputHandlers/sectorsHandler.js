var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var locationsMenu = require('../utils/createLocationMenu');

module.exports = function sectorHandler(input) {
    var lang = state.vars.lang;
    state.vars.lang = lang;
    var getMessage = translator(translations, lang);
    var sectors = JSON.parse(state.vars.sectors);
    var sector = sectors[input];
    var sectors_screens = JSON.parse(state.vars.sectors_screens);
    var current_sectors_screen = state.vars.current_sectors_screen;
    if(sector) {
        state.vars.selected_sector = sector;
        var cells = {};
        var village_table = project.getOrCreateDataTable('VillageInfo');
        var village_cursor = village_table.queryRows({vars: 
            {
                'provence': state.vars.selected_provence, 
                'district': state.vars.selected_district,
                'sector': state.vars.selected_sector
            }});
        while(village_cursor.hasNext()) {
            var row = village_cursor.next();
            cells[row.vars.cell] = row.vars.cell;
        }

        var message = getMessage('cell_title', {}, lang);

        var all_locations = locationsMenu(cells, message, lang);
        state.vars.cells_screens = JSON.stringify(all_locations.all_screens);
        state.vars.current_cells_screen = 1;
        state.vars.cells = JSON.stringify(all_locations.stored_locations);
        sayText(all_locations.all_screens[state.vars.current_cells_screen]);
        promptDigits('select_cell', {
            timeout: 5,
            maxDigits: 2,
            submitOnHash: false
        });
    } else if(input === '*' && sectors_screens[current_sectors_screen + 1]) {
        state.vars.current_sectors_screen = current_sectors_screen + 1;
        sayText(sectors_screens[state.vars.current_sectors_screen]);
        promptDigits('select_sector', {
            timeout: 5,
            maxDigits: 2,
            submitOnHash: false
        });
    } else {
        sayText(getMessage('invalid_input', {'$Menu': sectors_screens[state.vars.current_sectors_screen]}));
        promptDigits('select_sector', {
            timeout: 5,
            maxDigits: 2,
            submitOnHash: false
        });
    }
};
