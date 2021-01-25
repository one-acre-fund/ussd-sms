var handlerName = 'shs_type_handler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var registerSerialNumber = require('../register-serial-Number/registerSerialNumber');
var serialNumberHandler = require('../serial-number-handler/serialNumberHandler');
module.exports = {
    handlerName: handlerName,
    getHandler: function(onSerialValidated){
        return function(input){
            var serials = JSON.parse(state.vars.serialNumbers);
            if(input <= serials.length){ 
                var serial = serials[input-1];
                if(serial){  
                    var registeredSerial = registerSerialNumber(serial.unitSerialNumber, serial.unitType);
                    if(registeredSerial.length == 1){
                        global.sayText(translate('valid_shs_message',{},state.vars.shsLang));
                        onSerialValidated(registeredSerial[0]);
                    }
                    else{
                        //TODO: Add loging
                        console.log('error: multiple serial or none on one type'+ JSON.stringify(registeredSerial));
                    }
                }
                else{
                    //TODO: Add loging
                    console.log('error: no serial numbeer of choosen type');
                    global.sayText(translate('serial_number_request',{},state.vars.shsLang));
                    global.promptDigits(serialNumberHandler.handlerName);
                }
            }
            else{
                var allSerialTypes = serial.reduce(function(result,current,index){ return result+ (index+1)+ ') '+current.unitType + '\n';},'');
                global.sayText(translate('shs_type',{'$serialTypes': allSerialTypes},state.vars.shsLang));
                global.promptDigits(handlerName);
            }
        };

    }

};