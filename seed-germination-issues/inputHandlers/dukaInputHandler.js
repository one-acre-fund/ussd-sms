var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');
var createMenu = require('../../shared/createMenu');
var lotCodeInputHandler = require('./lotCodeInputHandler');
var monthInputHandler = require('./monthInputHandler');

var handlerName = 'rsgi_duka';
var months = {
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
    '12': 'December'
};
module.exports = {
    months: months,
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            input = input.replace(/\D/g, '');
            var getMessage = translator(translations, lang);
            var supportedDukas = lotCodeInputHandler.supported_dukas;
            var duka_option_values = JSON.parse(state.vars.duka_option_values);
            var duka_screens = JSON.parse(state.vars.duka_screens);
            var chosenOption = duka_option_values[input];
            var chosen_duka = supportedDukas[chosenOption];
            if(chosen_duka) {
                state.vars.chosen_duka = chosen_duka;
                var nextOption = getMessage('next_option', {}, lang);
                var monthsTitle = getMessage('months_title', {}, lang);
                var monthsMenu = createMenu(months, nextOption, monthsTitle);
                state.vars.months = JSON.stringify(monthsMenu.optionValues);
                state.vars.months_screens = JSON.stringify(monthsMenu.screens);
                state.vars.current_months_menu = 1;
                global.sayText(monthsMenu.screens[state.vars.current_months_menu]);
                global.promptDigits(monthInputHandler.handlerName);
            } else if(input == 99 && duka_screens[state.vars.current_dukas_menu + 1]) {
                // next page
                state.vars.current_dukas_menu +=1;
                global.sayText(duka_screens[state.vars.current_dukas_menu]);
                global.promptDigits(handlerName);
            } else {
                // wrong option
                global.sayText(duka_screens[state.vars.current_dukas_menu]);
                global.promptDigits(handlerName);
            }
        };
    }
};
