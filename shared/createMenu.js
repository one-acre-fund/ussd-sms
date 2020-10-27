
/**
 * a util to return menu and option values given the option names
 * @param {Array} optionNames an object of key value pairs (option_key: option value)
 * @param {String} nextScreenOption option for next screen -- 44) next screen --
 * @param {Number} maxCharacters max characters per screen (fall back to 140)
 */
module.exports = function (optionNames, nextScreenOption, maxCharacters) {
    var screen = 1;
    var screens = {};
    var message = '';
    maxCharacters = maxCharacters || 140;
    nextScreenOption = nextScreenOption || '';
    var optionValues = {};
    Object.keys(optionNames).forEach(function(allowedOption, index) {
        var label = index + 1 + ') ';
        if((message + label + optionNames[allowedOption]  + '\n' + nextScreenOption).length <= maxCharacters) {
            message += label + optionNames[allowedOption] + '\n';
            optionValues[index + 1] = allowedOption;
        }

        if((message + label + optionNames[allowedOption] + '\n' + nextScreenOption).length > maxCharacters || Object.keys(optionNames).length == index + 1) {
            if(Object.keys(optionNames).length == index + 1) {
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

