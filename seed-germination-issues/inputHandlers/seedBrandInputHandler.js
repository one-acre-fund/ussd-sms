var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');
var createSeedsMenu = require('../../shared/createMenu');
var customSeedBrandInputHandler = require('./customSeedBrandInputHandler');
var seedVarietyInputHandle = require('./seedVarietyInputHandler');

var handlerName = 'rsgi_seed_brand';
module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var seedGerminationIssues = require('../seedGerminationIssues');
            var otherOption = seedGerminationIssues.otherOption;
            var getMessage = translator(translations, lang);
            input = input.replace(/\D/g, '');
            var seeds_option_values = JSON.parse(state.vars.seeds_option_values);
            var seeds_screens = JSON.parse(state.vars.seeds_screens);
            var choosenOption = seeds_option_values[input];
            if(choosenOption) {
                if(choosenOption === otherOption[lang]) {
                    // have choosen Other on the menu
                    global.sayText(getMessage('custom_seed_brand', {}, lang));
                    global.promptDigits(customSeedBrandInputHandler.handlerName);
                } else {
                    // have choosen a valid option

                    state.vars.rsgi_seed_brand = choosenOption; // set the choosen brand to a state variable

                    var seedsTable = project.getOrCreateDataTable('seeds_and_varieties');
                    var cursor = seedsTable.queryRows({vars: {'seed_name': choosenOption}});
                    var index = 1;
                    var varieties = {};
                    var nextOption = getMessage('next_option', {}, lang);
                    while(cursor.hasNext()) {
                        var row = cursor.next();
                        varieties[row.vars.seed_variety] = row.vars.seed_variety;
                        index = index + 1;
                    }
                    var varietiesTitle = getMessage('seed_variety_title', {}, lang);
                    var varietiesMenu = createSeedsMenu(varieties, nextOption, varietiesTitle);
                    var varietiesScreens = varietiesMenu.screens;
                    var varietiesOptionValues = varietiesMenu.optionValues;
                    state.vars.varieties_option_values = JSON.stringify(varietiesOptionValues);
                    state.vars.varieties_screens = JSON.stringify(varietiesScreens);
                    state.vars.current_varieties_screen = 1;
                    
                    global.sayText(varietiesScreens[state.vars.current_varieties_screen]);
                    global.promptDigits(seedVarietyInputHandle.handlerName);
                }
            } else if(input == 77 && seeds_screens[state.vars.current_seeds_screen + 1]) {
                // display next screen
                state.vars.current_seeds_screen += 1;
                global.sayText(seeds_screens[state.vars.current_seeds_screen]);
                global.promptDigits(handlerName);
            } else {
                // have choosen an invalid option
                global.sayText(seeds_screens[state.vars.current_seeds_screen]);
                global.promptDigits(handlerName);
            }
        };
    }
};
