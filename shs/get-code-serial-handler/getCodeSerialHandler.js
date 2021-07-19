var handlerName = 'get_code_serial_handler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var registrationTypeHandler = require('../registration-type-handler/registrationTypeHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

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
                var serial = serialNumberDetails[input-1];
                onSerialValidated(serial,true);
            }
            else{
                // see how we can replace 'serial_numbers' with 'view_recent_code'
                var serialNumbersMessage = serialNumberDetails.reduce(function(result,current,index){ return result+ (index+1)+ ') '+current.serialNumber + '('+current.unitType+')\n';},'');
                global.sayText(translate('view_recent_code',{'$serialNumbers': serialNumbersMessage},state.vars.shsLang));
                global.promptDigits(handlerName);
            }
        };
    }
};