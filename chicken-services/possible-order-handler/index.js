var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');

var handlerName = 'change_chicken_confrm';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onOrderingConfirmed){
        return function(input){
            console.log('max_chicken'+state.vars.max_chicken);
            if((input >= 2) && (input <= state.vars.max_chicken)){
                state.vars.confirmed_number = input;
                onOrderingConfirmed();
            }
            else{
                var translate =  createTranslator(translations, project.vars.lang);
                global.sayText(translate('chicken_oder_out_of_bound',{'$number': state.vars.max_chicken}));
                global.promptDigits(handlerName);
            }
        };

    }
};