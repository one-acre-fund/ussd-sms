var handlerName = 'shs_type_handler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var registerSerialNumber = require('../register-serial-Number/registerSerialNumber');
var Log = require('../../logger/elk/elk-logger');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
module.exports = {
    handlerName: handlerName,
    getHandler: function(onSerialValidated){
        return function(input){
            var logger;
            notifyELK();
            var serials = JSON.parse(state.vars.serialNumbers);
            var registeredSerial;
            if(input <= serials.length){ 
                var serial = serials[input-1];
                if(serial){  
                    if(state.vars.replacement == '')
                        registeredSerial= registerSerialNumber(serial.serialNumber, serial.unitType);
                    else
                        registeredSerial= registerSerialNumber(serial.serialNumber, serial.unitType,JSON.parse(state.vars.replacement));
                    if(registeredSerial){
                        if(typeof(registeredSerial) === 'object' || _.isArray(registeredSerial)){
                            if(registeredSerial.length > 1){
                                logger = new Log();
                                logger.error('Multiple units with one unit type', {data: registerSerialNumber});
                            }else{
                                global.sayText(translate('valid_shs_message',{},state.vars.shsLang));
                                onSerialValidated(registeredSerial[0]);
                            }
                        }
                        if(registeredSerial == 'wrong serial'){
                            global.sayText(translate('invalid_shs_message',{},state.vars.shsLang));
                            global.promptDigits(handlerName);
                        }
                    }
                    stopRules();
                }
            }
            else{
                var allSerialTypes = serials.reduce(function(result,current,index){ return result+ (index+1)+ ') '+current.unitType + '\n';},'');
                global.sayText(translate('shs_type',{'$serialTypes': allSerialTypes},state.vars.shsLang));
                global.promptDigits(handlerName);
            }
        };
    }
};