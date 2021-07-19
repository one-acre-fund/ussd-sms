var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');
var createMenu = require('../../shared/createMenu');

var handlerName = 'rsgi_duka';
var months = { 'en-ke': {
    '1': 'January',
    '2': 'February',
    '3': 'March',
    '4': 'April',
    '5': 'May',
    '6': 'June',
    '7': 'July',
    '8': 'August',
    '9': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December'},
'sw': {
    '1': 'Januari',
    '2': 'Februari',
    '3': 'Machi',
    '4': 'Aprili',
    '5': 'Mei',
    '6': 'Juni',
    '7': 'Julai',
    '8': 'Agosti',
    '9': 'Septemba',
    '10': 'Oktoba',
    '11': 'Novemba',
    '12': 'Decemba'}
};
module.exports = {
    months: months,
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var monthInputHandler = require('./monthInputHandler');
            var duka = input && input.replace(/\d/g, '');
            var getMessage = translator(translations, lang);
            if(duka) {
                state.vars.chosen_duka = duka;
                var nextOption = getMessage('next_option', {}, lang);
                var monthsTitle = getMessage('months_title', {}, lang);
                var monthsMenu = createMenu(months[lang], nextOption, monthsTitle);
                state.vars.months = JSON.stringify(monthsMenu.optionValues);
                state.vars.months_screens = JSON.stringify(monthsMenu.screens);
                state.vars.current_months_menu = 1;
                global.sayText(monthsMenu.screens[state.vars.current_months_menu]);
                global.promptDigits(monthInputHandler.handlerName);

            } else {
                // wrong option
                global.sayText(getMessage('duka_title', {}, lang));
                global.promptDigits(handlerName);
            }
        };
    }
};
