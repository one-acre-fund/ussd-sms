var translations = require('../../translations/message-translations');
var translator = require('../../../utils/translator/translator');
var notifyELK = require('../../../notifications/elk-notification/elkNotification');

module.exports = {
    /**
     * Contains handler for the SBCC menu
     * @param {function} backMenu function that takes user back to the non client menu
     * @returns {function} handler for sbcc menu
     */
    getHandler: function(backMenu) {
        return function(input) {
            notifyELK();
            var lang = state.vars.lang;
            var getMessage = translator(translations, lang);
        
            switch (input.replace(/D/g, '')) {
            case '1':
                global.sayText(getMessage('enter_national_id', {}, lang));
                global.promptDigits('national_id', {
                    submitOnHash: true,
                    maxDigits: 8,
                    timeout: 5,
                });
                break;
            case '2':
                sayText(getMessage('forgotten-national-id', {}, lang));
                break;
            case '3':
                backMenu();
                global.promptDigits('NonClientMenu', {submitOnHash: true, maxDigits: 2, timeout: 5});
                break;
            default:
                global.sayText(getMessage('sbcc_menu', {}, lang));
                global.promptDigits('sbcc_menu', {
                    submitOnHash: false,
                    maxDigits: 2,
                    timeout: 5,
                });
                break;
            }
        };
    }
};
