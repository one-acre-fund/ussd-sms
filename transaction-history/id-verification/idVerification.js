var roster = require('../../rw-legacy/lib/roster/api');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var getTranslator = require('../../utils/translator/translator');
var translations = require('../translations');

var handlerName = 'id_input_handler';
module.exports = {
    handlerName: handlerName,
    getHandler: function (onIdValidated) {
        return function (input) {
            notifyELK();
            var lang = (contact && contact.vars.lang) || (state && state.vars.lang) || service.vars.lang || project.vars.lang;
            var translate = getTranslator(translations, lang);
            var client = roster.getClient(state.vars.account, state.vars.country);
            if(client.NationalId.slice(-4) !== input){
                global.sayText(translate('invalid_last_4_nid_digits'));
                global.promptDigits(handlerName);
                return;        
            }
            onIdValidated(client);
        };
    }
};