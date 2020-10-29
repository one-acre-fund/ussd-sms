var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');
var otherOption = require('../seedGerminationIssues');

var handlerName = 'rsgi_seed_brand';
module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var getMessage = translator(translations, lang);
            input = input.replace(/\D/g, '');
            var seeds_option_values = JSON.parse(state.vars.seeds_option_values);
            var seeds_screens = JSON.parse(state.vars.seeds_screens);
            var choosenOption = seeds_option_values[input];
            if(choosenOption) {
                if(choosenOption === otherOption[lang]) {
                    // have choosen Other on the menu
                } else {
                    // have choosen a valid option
                    var seedsTable = project.getOrCreateDataTable('seeds_and_varieties');
                    var cursor = seedsTable.queryRows({vars: {'seed_name': choosenOption}});
                    var index = 1;
                    var varieties = {};
                    var nextOption = getMessage('next_option', {}, lang);
                    while(cursor.hasNext()) {
                        var row = cursor.next();
                        varieties[row.vars.seed_name] = row.vars.seed_name;
                        index = index + 1;
                    }
                }
            } else if(input == 99 && seeds_screens[state.vars.current_seeds_screen + 1]) {
                // display next screen
                state.vars.current_seeds_screen += 1;
                global.sayText(seeds_screens[state.vars.current_seeds_screen]);
                global.promptDigits(handlerName);
            } else {
                // have choosen an invalid option
                var initialSeedBrandScreen = getMessage('seeds_brand', {
                    '$Menu': seeds_screens[state.vars.current_seeds_screen]
                }, lang);
                global.sayText(initialSeedBrandScreen);
                global.promptDigits(handlerName);
            }
        };
    }
};
