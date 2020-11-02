var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');
var createSeedsMenu = require('../../shared/createMenu');
var monthInputHandler = require('./monthInputHandler');

var handlerName = 'rsgi_lot_code';
var supported_dukas = {
    'kak': 'Kakamega Duka',
    'mal': 'Malava Duka',
    'ing': 'Ingotse Duka',
    'bun': 'Bungoma Duka',
    'malak': 'Malakisi Duka',
    'kap': 'Kapsabet Duka',
    'kab': 'Kabiyet Duka',
    'nyan': 'Nyang\'oma Kogelo Duka',
    'yal': 'Yala Duka',
    'lua': 'Luanda Duka'
};
module.exports = {
    supported_dukas: supported_dukas,
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var getMessage = translator(translations, lang);
            state.vars.lot_code = input;
            var nextOption = getMessage('next_option', {}, lang);
            var dukasTitle = getMessage('duka_title', {}, lang);
            var dukasMenu = createSeedsMenu(supported_dukas, nextOption, dukasTitle);
            state.vars.duka_option_values = JSON.stringify(dukasMenu.optionValues);
            state.vars.duka_screens = JSON.stringify(dukasMenu.screens);
            state.vars.current_dukas_menu = 1;
            global.sayText(dukasMenu.screens[state.vars.current_dukas_menu]);
            global.promptDigits(monthInputHandler.handlerName);
        };
    }
};
