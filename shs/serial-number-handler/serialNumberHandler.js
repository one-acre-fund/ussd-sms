var handlerName = 'serial_number_handler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var shsTypeHandler = require('../shs-type-handler/shsTypeHandler');
var isValidSerial = function(input){
    //TODO: call endpoint that returns types associated to the serial number if valid serial
    input+1;
    return ['firstType', 'secondType'];
};
module.exports = {
    handlerName: handlerName,
    getHandler: function(onSerialValidated){
        return function(input){
            var serialNumber = isValidSerial(input);
            if(serialNumber) {
                if(serialNumber.length > 1){
                    state.vars.serialTypes = JSON.stringify(serialNumber);
                    state.vars.serialNumber = input;
                    var serialTypes = serialNumber.reduce(function(result,current,index){ return result+ (index+1)+ ') '+current + '\n';},'');
                    global.sayText(translate('shs_type',{'$serialTypes': serialTypes},state.vars.shsLang));
                    global.promptDigits(shsTypeHandler.handlerName);
                }else{
                    //TODO: Register shs on account number
                    global.sayText(translate('valid_shs_message',{},state.vars.shsLang));
                    onSerialValidated(input);
                }
            }
            else{
                global.sayText(translate('invalid_shs_message',{},state.vars.shsLang));
                global.promptDigits(handlerName);
            }
        };
    }
};