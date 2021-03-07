var translator = require('../../../utils/translator/translator');
var translations = require('../translations/index');

var handlerName = 'bu_reg_continue_to_ordering';

module.exports = {
    handlerName: handlerName,
    getHandler: function(language) {
        return function(input) {
            // var getMessage = translator(translations, language);
            if(input === '1') {
                // trigger ordering
                // at the moment just add a sayText
                global.sayText('ordering is coming soon');
            } else if(input === '0') {
                global.stopRules();
            }
        };
    }
};
