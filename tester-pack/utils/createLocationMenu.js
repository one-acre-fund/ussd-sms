var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

module.exports = function createLocationsMenu(locations, message, lang) {
    var getMessage = translator(translations, lang);
    var all_screens = {};
    var screen = 1;
    var stored_locations = {};
    var next_page = getMessage('next_page', {}, lang);

    Object.keys(locations).forEach(function(location, index) {
        var label = index + 1;
        stored_locations[label] = locations[location];
        if((message + getMessage('locations', {'$label': label, '$location': location }, lang) + next_page).length <= 140) {
            message = message + getMessage('locations', {'$label': label, '$location': location }, lang);
        }
        
        if((message + getMessage('locations', {'$label': label, '$location': location }, lang) + next_page).length > 140 || Object.keys(locations).length == index + 1) {
            if(Object.keys(locations).length === index + 1) {
                all_screens[screen] = message;
            } else {
                all_screens[screen] = message + next_page;
                screen = screen + 1;
                message = getMessage('locations', {'$label': label, '$location': location }, lang);
            }
        }
    });

    return {all_screens: all_screens, stored_locations: stored_locations};
};
