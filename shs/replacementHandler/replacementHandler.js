var handlerName = 'replacement_handler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var serialNumberHandler = require('../serial-number-handler/serialNumberHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
module.exports = {
    handlerName: handlerName,
    getHandler: function(){
        return function(input){
            notifyELK();
            var serials = JSON.parse(state.vars.serialNumberDetails);
            if(input <= serials.length){ 
                var serial = serials[input-1];
                if(serial){ 
                    state.vars.replacement =  JSON.stringify(serial);
                    global.sayText(translate('serial_number_request',{},state.vars.shsLang));
                    global.promptDigits(serialNumberHandler.handlerName);

                }
                else{
                    //TODO: Add loging
                    console.log('error: no serial number of choosen type');
                    global.stopRules();
                }
            }
            else{
                var serialNumbers = serials.reduce(function(result,current,index){ return result+ (index+1)+ ') '+current.unitSerialNumber + '('+current.unitType+')\n';},'');
                global.sayText(translate('replacement_menu',{'$serialNumbers': serialNumbers},state.vars.shsLang));
                global.promptDigits(handlerName);
            }
        };

    }

};