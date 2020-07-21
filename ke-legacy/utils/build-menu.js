var translatorFactory = require('../../utils/translator/translator');
var translations = require('../translations/index');

var translator = translatorFactory(translations, 'en');

/**
 * Used to build menu from the menu options
 * @param {Array} menuOptions menu options used to build the menu from the translations ex: [{key: 'change_lang', options: {'$label': 1}}];
 * @param {String} lang Language to be used other than the default language
 */
function buildMenu(menuOptions, lang) {
    var menuText = '';
    var multipleScreenMenuOptions = [];

    menuOptions.forEach(function(menuOption, index) {
        var currentOption = translator(menuOption.key, menuOption.options, lang);
        if((menuText + currentOption).length <= 140) {
            menuText = menuText + currentOption;
        } else {
            multipleScreenMenuOptions.push(menuText);
            menuText = currentOption;
        }

        if(multipleScreenMenuOptions.length > 0 && index == menuOptions.length - 1) {
            multipleScreenMenuOptions.push(menuText);
        }
    });

    if(multipleScreenMenuOptions.length > 0) {
        return multipleScreenMenuOptions;
    } 

    return menuText;
}

module.exports = buildMenu;
