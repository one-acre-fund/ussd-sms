var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var createFarmersMenu = require('../../utils/createFarmersMenu');

module.exports = function registeredConfirmedHandler(input) {
    var lang = state.vars.lang || 'en';
    
    var getMessage = translator(translations, lang);
    var farmers = JSON.parse(state.vars.farmers);
    var registeredScreens = [];
    var confirmedScreens = [];
    if(input == 1) {
        var registered = farmers.registered;
        registeredScreens = createFarmersMenu(registered, '', lang).all_screens;
        state.vars.current_screen = 0;
        state.vars.screens = JSON.stringify(registeredScreens)
        sayText(registeredScreens[state.vars.current_screen]);
    } else if(input == 2) {
        var confirmed = farmers.confirmed;
        confirmedScreens = createFarmersMenu(confirmed, '', lang).all_screens;
        state.vars.current_screen = 0;
        state.vars.screens = JSON.stringify(confirmedScreens)
        sayText(confirmedScreens[state.vars.current_screen]);
    }

    if(confirmedScreens.length > 1 || registeredScreens.length > 0) {
        promptDigits('next_farmers_list', {
            maxDigits: 1,
            timeout: 10,
            submitOnHash: false
        })
    }

}