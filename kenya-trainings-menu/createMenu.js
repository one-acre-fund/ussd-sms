var options = require('./options');
var siteCanAccessNutrition = require('./siteCanAccessNutrition');

module.exports = function (lang, districtsTableName, client) {
    var optionNames = Object.keys(options);

    var canAccessNutrition = siteCanAccessNutrition(districtsTableName, client);
    // gather the options to skip conditionally
    var optionsToSkip = [];

    if(!canAccessNutrition) {
        optionsToSkip.push('nutrition_training');
    }
    // remove the mentioned options to skip
    var allowedOptions = optionNames.filter(function(allowedOptionName) {
        return optionsToSkip.indexOf(allowedOptionName) == -1;
    });
    var nextMessages = {
        'en-ke': '0:MORE',
        'sw': '0:Endelea'
    };
    var nextScreenOption = nextMessages[lang];
    var screen = 1;
    var screens = {};
    var message = '';
    var optionValues = {};
    allowedOptions.forEach(function(allowedOption, index) {
        var label = index + 1 + ':';
        if((message + label + options[allowedOption][lang] + nextScreenOption).length <= 140) {
            message += label + options[allowedOption][lang];
            optionValues[index + 1] = allowedOption;
        }

        if((message + label + options[allowedOption][lang] + nextScreenOption).length > 140 || allowedOptions.length == index + 1) {
            if(allowedOptions.length == index + 1) {
                screens[screen] = message;
            } else {
                screens[screen] = message + nextScreenOption;
                screen = screen + 1;
                message = '';
            }
        }
    });
    return {screens: screens, optionValues: optionValues};
};
