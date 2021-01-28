var handlerName = 'serial_number_handler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var shsTypeHandler = require('../shs-type-handler/shsTypeHandler');
var registerSerialNumber = require('../register-serial-Number/registerSerialNumber');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

module.exports = {
    handlerName: handlerName,
    getHandler: function(onSerialValidated){
        return function(input){
            notifyELK();
            var serialNumber = registerSerialNumber(input);
            if(serialNumber) {
                if(serialNumber.length > 1){
                    state.vars.serialNumbers = JSON.stringify(serialNumber);
                    var serialTypes = serialNumber.reduce(function(result,current,index){ return result+ (index+1)+ ') '+current.unitType + '\n';},'');
                    global.sayText(translate('shs_type',{'$serialTypes': serialTypes},state.vars.shsLang));
                    global.promptDigits(shsTypeHandler.handlerName);
                }else{
                    global.sayText(translate('valid_shs_message',{},state.vars.shsLang));
                    onSerialValidated([serialNumber[0]]);
                }
            }
            else{
                global.sayText(translate('invalid_shs_message',{},state.vars.shsLang));
                global.promptDigits(handlerName);
            }
        };
    }
};