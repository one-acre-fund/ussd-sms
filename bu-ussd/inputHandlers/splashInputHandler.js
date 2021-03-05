var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var rosterAPI = require('../../rw-legacy/lib/roster/api');
var handlerName = 'bu_splash';

var languageSwapOptions = {
    'en-bu': { // current language
        '98': 'bu', // next language if choice is 98
        '99': 'fr-bu', // next language if choice is 99
    },
    'bu': {
        '98': 'en-bu',
        '99': 'fr-bu',
    },
    'fr-bu': {
        '98': 'en-bu',
        '99': 'bu',
    }
};

var languageOptions = ['99', '98'];

/**
 * handler generator for the splash menu
 * @param {string} lang language
 */
function getHAndler(language, onAccountNumberValidated) {
    return function(input) {
        var accountNumber = input.replace(/\D/g, '');
        var lang = language || contact.vars.lang;
        var getMessage = translator(translations, language);
        if(languageOptions.indexOf(input) !== -1) {
            // change language and reprompt for account number
            lang = languageSwapOptions[lang][input];
            contact.vars.lang = lang;
            global.sayText(getMessage('splash', {}, lang));
            global.promptDigits(handlerName);
        } else {
            //validate the account number account number
            if(rosterAPI.authClient(accountNumber, project.vars.country)) {
                var client = rosterAPI.getClient(accountNumber, project.vars.country);
                if(client) {
                    // valid account number. continue to next step
                    onAccountNumberValidated(language, client);
                    return;
                }
                // invalid account number. reprompt for account number
                global.sayText(getMessage('splash', {}, language));
                global.promptDigits(handlerName);
                return;
            }
            // invalid account number. reprompt for account number
            global.sayText(getMessage('splash', {}, language));
            global.promptDigits(handlerName);
        }
    };
}

module.exports = {
    handlerName: handlerName,
    getHAndler: getHAndler
};
