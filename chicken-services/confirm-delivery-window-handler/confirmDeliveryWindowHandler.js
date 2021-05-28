var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');
var translate =  createTranslator(translations, service.vars.lang);
var notifyELK = require('../../notifications/elk-notification/elkNotification');

var handlerName = 'confirm_dlivery_window_handler_rwchx';

module.exports = {
    handlerName: handlerName,
    getHandler: function(onOrderFinalized) {
        return function(input) {
            notifyELK();

            // valid input
            if(input == 1) {
                // confirm
                onOrderFinalized();
            } else if(input == 0) {
                // return home
                global.sayText(state.vars.current_menu_str);
                promptDigits('cor_menu_select', { 'submitOnHash': false});
            } else {
                // reprompt
                var capsDetails = JSON.parse(state.vars.capsDetails);
                var chicken_number = state.vars.confirmed_number;

                var lang = service.vars.lang || 'ki';
                global.sayText(translate('delivery_window', {
                    '$delivery_window': capsDetails['delivery_window_' + lang],
                    '$chicken_number': chicken_number
                }, lang));
                global.promptDigits(handlerName);
            }
        };
    }
};
