var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var getClient = require('../../shared/rosterApi/getClient');
var serviceHandler = require('./serviceInputHandler');

var accountNumberHandlerName = 'account_number';

module.exports = 
{
    handlerName: accountNumberHandlerName,
    handler: function(input) {
        var lang = state.vars.lang;
        var getMessage = translator(translations, lang);
        var result = input.replace(/\D/g, '');
        if(result == 99) {
        // change the language and reprompt for account number
            if(lang == 'sw') {
                lang = 'en-ke';
            } else {
                lang = 'sw';
            }
            state.vars.lang = lang;
            var changeLang = getMessage('lang', {}, lang);
            var splashMenu = getMessage('splash', {}, lang); + changeLang;
            sayText(splashMenu);
            promptDigits(accountNumberHandlerName, {
                maxDigits: 8,
                submitOnHash: false,
            });
        } else {
            var client = getClient(result, 'kenya');
            if(client) {
                var options = getMessage('register', {'$option': 1}, lang);
                var main_menu = getMessage('select_service', {'$Menu': options}, lang);
                state.vars.main_menu = main_menu;
                sayText(main_menu);
                promptDigits(serviceHandler.handlerName, {
                    maxDigits: 2,
                    submitOnHash: false,
                });
            } else {
                var spash = getMessage('splash', {}, lang);
                var retrySplashMenu = getMessage('invalid_input', {'$Menu': spash}, lang);
                sayText(retrySplashMenu);
                promptDigits(accountNumberHandlerName, {
                    maxDigits: 8,
                    submitOnHash: false,
                });
            }
        }
    }
};