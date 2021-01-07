var handlerName = 'serial_number_handler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);

var isValidSerial = function(input){
    return input;

};
module.exports = {
    handlerName: handlerName,
    getHandler: function(onSerialValidated){
        return function(input){
            if(isValidSerial(input)) {
                global.sayText(translate('valid_shs_message',{},state.vars.shsLang));
                onSerialValidated(input);
            }
            else{
                global.sayText(translate('invalid_shs_message',{},state.vars.shsLang));
                global.promptDigits(handlerName);
            }
        };
    }
};