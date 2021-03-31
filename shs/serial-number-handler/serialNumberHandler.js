var handlerName = 'serial_number_handler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var shsTypeHandler = require('../shs-type-handler/shsTypeHandler');
var registerSerialNumber = require('../helper-functions/registerSerialNumber');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

module.exports = {
    handlerName: handlerName,
    getHandler: function(onSerialValidated){
        return function(input){
            notifyELK();
            var serialNumber;
            if(state.vars.replacement == ''){
                serialNumber= registerSerialNumber(input);
            }
            else{
                serialNumber= registerSerialNumber(input,null,JSON.parse(state.vars.replacement));
            }
            if(serialNumber){
                if(typeof(serialNumber) === 'object' || _.isArray(serialNumber)){
                    if(serialNumber.length > 1){
                        state.vars.serialNumbers = JSON.stringify(serialNumber);
                        var serialTypes = serialNumber.reduce(function(result,current,index){ return result+ (index+1)+ ') '+current.unitType + '\n';},'');
                        global.sayText(translate('shs_type',{'$serialTypes': serialTypes},state.vars.shsLang));
                        global.promptDigits(shsTypeHandler.handlerName);
                    }else{
                        if(state.vars.exists == 'true'){
                            global.sayText(translate('valid_exists_shs_message',{'$code': serialNumber[0].keyCode},state.vars.shsLang));
                            global.stopRules();
                        }
                        else{
                            global.sayText(translate('valid_shs_message',{},state.vars.shsLang));
                            onSerialValidated(serialNumber[0]);
                        }
                    }
                 
                }
                if(serialNumber == 'wrong serial'){
                    global.sayText(translate('invalid_shs_message',{},state.vars.shsLang));
                    global.promptDigits(handlerName);
                }
            }
            stopRules();
        };
    }
};