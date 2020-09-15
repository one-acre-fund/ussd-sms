var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var sectorsInputHandler = require('./sectorInputHandler');

var handlerName = 'pshops_locator_district_handler';
var districts = {
    '1': 'Gakenke',
    '2': 'Kayonza',
    '3': 'Rwamagana',
    '4': 'Gicumbi',
};

module.exports = {
    handlerName: handlerName,
    /**
     * Input handler for the districts
     * @param {String} lang language to be used for translations
     * @param {Function} displayDistricts function that displays districts screen
     * @param {Function} displaySectors function to display the sectors screen
     */
    getHandler: function(lang, displayDistricts, getSectors, agrodealers_address_table) {
        return function(input) {
            var getMessage = translator(translations, lang);
            var district = districts[input.toString().trim()];
            if(district) {
                var sectorsObject = getSectors(district, agrodealers_address_table);
                var screens = sectorsObject.screens;
                var sectorsList = sectorsObject.list;
                state.vars.sectors_list = JSON.stringify(sectorsList);
                state.vars.current_sectors_screen = 1;
                state.vars.sectors_screens = JSON.stringify(screens);
                state.vars.selected_district = district;
                sayText(screens[state.vars.current_sectors_screen]);
                promptDigits(sectorsInputHandler.handlerName);
            } else if(input == 5) {
                sayText(getMessage('invalid_district', {}, lang));
                stopRules();
                return;
            } else {
                displayDistricts();
                promptDigits(handlerName);
                return;
            }
        };
    }
};
