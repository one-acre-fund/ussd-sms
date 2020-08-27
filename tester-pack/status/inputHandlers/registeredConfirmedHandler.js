var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var createFarmersMenu = require('../../utils/createFarmersMenu');

module.exports = function registeredConfirmedHandler(input) {
    var lang = state.vars.lang;
    
    var getMessage = translator(translations, lang);
    var farmers = JSON.parse(state.vars.farmers);
    var registeredScreens = [];
    var confirmedScreens = [];
    var title='';
    if(input == 1) {
        var registered = farmers.registered;
        title = getMessage('registered_title', {}, lang);
        registeredScreens = createFarmersMenu(registered, title, lang).all_screens;
        state.vars.current_screen = 1;
        state.vars.screens = JSON.stringify(registeredScreens);
        sayText(registeredScreens[state.vars.current_screen]);
    } else if(input == 2) {
        var confirmed = farmers.confirmed;
        title = getMessage('confirmed_title', {}, lang);
        confirmedScreens = createFarmersMenu(confirmed, title, lang).all_screens;
        state.vars.current_screen = 1;
        state.vars.screens = JSON.stringify(confirmedScreens);
        sayText(confirmedScreens[state.vars.current_screen]);
    } else {
        // if the input is incorrect
        var menu = getMessage('registered_confirmed', {'$registered': Object.keys(farmers.registered).length, '$confirmed': Object.keys(farmers.confirmed).length}); 
        sayText(getMessage('invalid_input', {'$Menu': menu}, lang));
    }

    if(Object.keys(confirmedScreens).length > 1 || Object.keys(registeredScreens).length > 0) {
        promptDigits('next_farmers_list', {
            maxDigits: 2,
            timeout: 10,
            submitOnHash: false
        });
    }

};
