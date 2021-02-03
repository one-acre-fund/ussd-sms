var handlerName = 'registrationTypeHandler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var serialNumberHandler = require('../serial-number-handler/serialNumberHandler');
var translate =  createTranslator(translations, project.vars.lang);
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var replacementHandler = require('../replacementHandler/replacementHandler');
var getCode = require('../register-serial-Number/getCode');

module.exports = {
    handlerName: handlerName,
    getHandler: function(){
        return function(input){
            notifyELK();
            if(input == 1){
                global.sayText(translate('serial_number_request',{},state.vars.shsLang));
                global.promptDigits(serialNumberHandler.handlerName);
            }
            else if(input == 2){
                var serialNumberDetails = getCode(state.vars.account);
                if(serialNumberDetails){
                    state.vars.serialNumberDetails = JSON.stringify(serialNumberDetails);
                    var serialNumbers = serialNumberDetails.reduce(function(result,current,index){ return result+ (index+1)+ ') '+current.unitSerialNumber + '('+current.unitType+')\n';},'');
                    global.sayText(translate('replacement_menu',{'$serialNumbers': serialNumbers},state.vars.shsLang));
                    global.promptDigits(replacementHandler.handlerName);
                }
            }
            else{
                global.sayText(translate('register_serial_menu',{},state.vars.shsLang));
                global.promptDigits(handlerName);
            }

        };
    }

};