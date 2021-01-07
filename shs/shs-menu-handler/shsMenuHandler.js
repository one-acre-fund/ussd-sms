var handlerName = 'shs_menu_handler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var serialNumberHandler = require('../serial-number-handler/serialNumberHandler');

module.exports = {
    handlerName: handlerName,
    getHandler: function(onMenuChosen){
        return function (input) {
            if(input == 1){
                global.sayText(translate('serial_number-request',{},state.vars.shsLang));
                global.promptDigits(serialNumberHandler);
            }else if(input == 2){
                onMenuChosen(3);
            }else if(input == 3){
                onMenuChosen(3);
            }else if(input == 4){
                onMenuChosen(4);
            }

        };

    }


};