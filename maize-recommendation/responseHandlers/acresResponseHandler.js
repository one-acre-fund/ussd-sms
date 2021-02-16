var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var maizeResponseHandler = require('./maizeResponseHandler');

var acresHandlerName = 'maize_rec_acres';
var bags_of_maize = {
    '4.1': {
        '$min_a': 4,
        '$min_b': 4,
        '$max_b': 5,
        '$min_c': 5
    },
    '4.2': {
        '$min_a': 7,
        '$min_b': 7,
        '$max_b': 10,
        '$min_c': 10
    },
    '4.3': {
        '$min_a': 11,
        '$min_b': 12,
        '$max_b': 15,
        '$min_c': 15
    },
    '4.4': {
        '$min_a': 13,
        '$min_b': 14,
        '$max_b': 20,
        '$min_c': 21
    }};

module.exports = {
    handlerName: acresHandlerName,
    getHandler: function(lang){
        return function() {

            var getMessage  = translator(translations, lang);
            var input = content || '';
            var acres = input.trim().toUpperCase();

            var maize_bags_title = getMessage('maize_bags_title', {}, lang);
            var bags_per_acre_title = getMessage('bags_per_acre_title', {}, lang);
            var options;
            var message;
            if(acres == 'A') {
                // goto message 4.1
                options = getMessage('maize_bags', bags_of_maize['4.1'], lang);
                message = maize_bags_title + options;
            } else if(acres == 'B') {
                // goto message 4.2
                options = getMessage('maize_bags', bags_of_maize['4.2'], lang);
                message = maize_bags_title + options;
            } else if(acres == 'C'){
                // goto message 4.3
                options = getMessage('maize_bags', bags_of_maize['4.3'], lang);
                message = maize_bags_title + options;
            } else if(acres == 'D' || acres == 'E'){
                // goto message 4.4
                options = getMessage('maize_bags', bags_of_maize['4.4'], lang);
                message = bags_per_acre_title + options;
            } else {
                // reprompt for acres
                global.sendReply(state.vars.acres_message);
                global.waitForResponse(acresHandlerName);
                return;
            }
            state.vars.maize_message = message;
            global.sendReply(message);
            global.waitForResponse(maizeResponseHandler.handlerName);
        };
    } 
};
