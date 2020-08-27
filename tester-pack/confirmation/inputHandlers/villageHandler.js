var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var farmersMenu = require('../../utils/createFarmersMenu');

module.exports = function villageHandler(input) {
    var lang = state.vars.lang;
    state.vars.lang = lang;
    var getMessage = translator(translations, lang);
    var villages = JSON.parse(state.vars.villages);
    var village = villages[input];
    var villages_screen = JSON.parse(state.vars.villages_screen);
    var current_villages_screen = state.vars.current_villages_screen;
    if(village) {
        state.vars.selected_village = JSON.stringify(village);
        var farmers = {};
        var farmers_table = project.initDataTableById(service.vars.ExtensionFarmers);
        var farmers_cursor = farmers_table.queryRows({vars: {'village_id': village.village_id}});
        var index = 0;
        if(!farmers_cursor.hasNext()) {
            // if no farmer has registered in the given village
            sayText(getMessage('no_farmers_found', {'$village_name': village.village_name}, lang));
            stopRules();
            return;
        }
        while(farmers_cursor.hasNext()) {
            var row = farmers_cursor.next();
            var nid = row.vars.national_id;
            var fn = row.vars.first_name;
            var ln = row.vars.last_name;
            var rowId = row.vars.id;
            index = index + 1;
            farmers[index] = {
                national_id: nid,
                first_name: fn,
                last_name: ln,
                row_id: rowId
            };
        }

        var message = getMessage('farmers_title', {}, lang);
        state.vars.farmers = JSON.stringify(farmers);
        var screens = farmersMenu(farmers, message, lang);

        state.vars.farmers = JSON.stringify(screens.stored_farmers);
        state.vars.farmers_screens = JSON.stringify(screens.all_screens);
        state.vars.current_farmers_screen = 1;
        sayText(screens.all_screens[state.vars.current_farmers_screen]);
        promptDigits('select_farmer', {
            timeout: 5,
            maxDigits: 2,
            submitOnHash: false
        });
    } else if(input == 77 && villages_screen[current_villages_screen + 1]) {
        state.vars.current_villages_screen = current_villages_screen + 1;
        sayText(villages_screen[state.vars.current_villages_screen]);
        promptDigits('select_village', {
            timeout: 5,
            maxDigits: 2,
            submitOnHash: false
        });
    } else {
        sayText(getMessage('invalid_input', {'$Menu': villages_screen[state.vars.current_villages_screen]}, lang));
        promptDigits('select_village', {
            timeout: 5,
            maxDigits: 2,
            submitOnHash: false
        });  
    }
};
