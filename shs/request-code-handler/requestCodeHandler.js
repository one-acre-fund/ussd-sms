var handlerName = 'request_code_handler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var registerSerialNumber = require('../helper-functions/registerSerialNumber');
var shsTypeHandler = require('../shs-type-handler/shsTypeHandler');
var registrationTypeHandler = require('../registration-type-handler/registrationTypeHandler');

module.exports = {
    handlerName: handlerName,
    getHandler: function(onSerialValidated){
        return function(input){
            notifyELK();
            var serialNumberDetails = JSON.parse(state.vars.serialNumberDetails);
            if(input == 99){
                global.sayText(translate('register_serial_menu',{},state.vars.shsLang));
                global.promptDigits(registrationTypeHandler.handlerName);
            }
            else if(input <= serialNumberDetails.length){
                // this is where requesting for new activation/unlock codes happens
                var serialNumber = registerSerialNumber(serialNumberDetails[input-1].serialNumber);
                if(serialNumber) {
                    if(typeof(serialNumber) === 'object' || _.isArray(serialNumber)){
                        if(serialNumber.length > 1){
                            state.vars.serialNumbers = JSON.stringify(serialNumber);
                            var serialTypes = serialNumber.reduce(function(result,current,index){ return result+ (index+1)+ ') '+current.unitType + '\n';},'');
                            global.sayText(translate('shs_type',{'$serialTypes': serialTypes},state.vars.shsLang));
                            global.promptDigits(shsTypeHandler.handlerName);
                        }else{
                            state.vars.unit_to_update = JSON.stringify(serialNumber[0]);
                            onSerialValidated(serialNumber[0],true);
                        }
                    }
                    
                }
                stopRules();
            }
            else{
                var serialNumbersMessage = serialNumberDetails.reduce(function(result,current,index){ return result+ (index+1)+ ') '+current.serialNumber + '('+current.unitType+')\n';},'');
                global.sayText(translate('serial_numbers',{'$serialNumbers': serialNumbersMessage},state.vars.shsLang));
                global.promptDigits(handlerName);
            }
        };
    }
};