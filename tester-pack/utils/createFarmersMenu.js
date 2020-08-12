var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');

module.exports = function createfarmersMenu(farmers, message, lang) {
    var getMessage = translator(translations, lang);
    var all_screens = {};
    var screen = 1;
    var stored_farmers = {};
    var next_page = getMessage('next_page', {}, lang);

    Object.keys(farmers).forEach(function(label, index) {
        stored_farmers[label] = farmers[label];
        if((message + getMessage('farmers', {'$label': label, '$first_name': farmers[label].first_name, '$last_name': farmers[label].last_name }, lang) + next_page).length <= 140) {
            message = message + getMessage('farmers', {'$label': label, '$first_name': farmers[label].first_name, '$last_name': farmers[label].last_name }, lang);
        }
        
        if((message + getMessage('farmers', {'$label': label, '$first_name': farmers[label].first_name, '$last_name': farmers[label].last_name }, lang) + next_page).length > 140 || Object.keys(farmers).length == index + 1) {
            if(Object.keys(farmers).length === index + 1) {
                all_screens[screen] = message;
            } else {
                all_screens[screen] = message + next_page;
                screen = screen + 1;
                message = getMessage('farmers', {'$label': label, '$first_name': farmers[label].first_name, '$last_name': farmers[label].last_name }, lang);
            }
        }
    });

    return {all_screens: all_screens, stored_farmers: stored_farmers};
};
