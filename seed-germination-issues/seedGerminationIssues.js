var createSeedsMenu = require('../shared/createMenu');
var translator = require('../utils/translator/translator');
var translations = require('./translations/index');
var seedBrandInputHandler = require('./inputHandlers/seedBrandInputHandler');

var otherOption = {
    'sw': 'Nyingine',
    'en-ke': 'Other'
};

/**
 * Starts the seed germination issues  
 * @param {String} lang language used for the service
 */
function seedGerminationIssues(lang) {
    var getMessage = translator(translations, lang);
    var seedsTable = project.getOrCreateDataTable('seeds_and_varieties');
    var cursor = seedsTable.queryRows({vars: {}});
    
    var index = 1;
    var seeds = {};
    var nextOption = getMessage('next_option', {}, lang);
    
    while(cursor.hasNext()) {
        var row = cursor.next();
        seeds[row.vars.seed_name] = row.vars.seed_name;
        index = index + 1;
    }
    seeds[otherOption[lang]] = otherOption[lang];
    var SeedBrandTitle = getMessage('seeds_brand_title', {}, lang);
    var seedsMenu = createSeedsMenu(seeds, nextOption, SeedBrandTitle);
    var seedsScreens = seedsMenu.screens;
    var seedsOptionValues = seedsMenu.optionValues;
    state.vars.seeds_option_values = JSON.stringify(seedsOptionValues);
    state.vars.seeds_screens = JSON.stringify(seedsScreens);
    state.vars.current_seeds_screen = 1;

    global.sayText(seedsMenu.screens[state.vars.current_seeds_screen]);
    global.promptDigits(seedBrandInputHandler.handlerName);
}

module.exports = {
    start: seedGerminationIssues,
    otherOption: otherOption
};
