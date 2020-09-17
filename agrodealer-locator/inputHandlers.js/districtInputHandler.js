var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var sectorsInputHandler = require('./sectorInputHandler');

var handlerName = 'pshops_locator_district_handler';
var districts = {
    '1': 'Gakenke',
    '2': 'Kayonza',
    '3': 'Rwamagana'
};

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang, displayDistricts, getSectors, agrodealers_address_table) {
        return function(input) {
            var getMessage = translator(translations, lang);
            var district = districts[input.toString().trim()];
            if(district) {
                var sectorsObject = getSectors(district, agrodealers_address_table, lang);
                var screens = sectorsObject.screens;
                var sectorsList = sectorsObject.list;
                state.vars.sectors_list = JSON.stringify(sectorsList);
                state.vars.current_sectors_screen = 1;
                state.vars.sectors_screens = JSON.stringify(screens);
                state.vars.selected_district = district;
                global.sayText(screens[state.vars.current_sectors_screen]);
                global.promptDigits(sectorsInputHandler.handlerName);
            } else if(input == 4) {
                var message = getMessage('invalid_district', {}, lang);
                global.sayText(message);
                global.stopRules();
            } else {
                displayDistricts(lang);
                global.promptDigits(handlerName);
            }
        };
    },
};
