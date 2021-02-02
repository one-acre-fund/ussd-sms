var handlerName = 'shs_menu_handler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var registrationTypeHandler = require('../registrationTypeHandler/registrationTypeHandler');
var getCode = require('../register-serial-Number/getCode');
var getCodeSerialHandler = require('../get-code-serial-handler/getCodeSerialHandler');
var requestCodeHandler = require('../request-code-handler/requestCodeHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
module.exports = {
    handlerName: handlerName,
    getHandler: function(){
        return function (input) {
            notifyELK();
            if(input == 1){
                global.sayText(translate('register_serial_menu',{},state.vars.shsLang));
                global.promptDigits(registrationTypeHandler.handlerName);
            }else if(input == 2){
                var serialNumberDetails = getCode(state.vars.account);
                if(serialNumberDetails){
                    state.vars.serialNumberDetails = JSON.stringify(serialNumberDetails);
                    var serialNumbers = serialNumberDetails.reduce(function(result,current,index){ return result+ (index+1)+ ') '+current.serialNumber + '\n';},'');
                    global.sayText(translate('serial_numbers',{'$serialNumbers': serialNumbers},state.vars.shsLang));
                    global.promptDigits(requestCodeHandler.handlerName);
                }
                else if(serialNumberDetails != null)
                    global.sayText(translate('no_serial_message',{},state.vars.shsLang));
                global.stopRules();
            }
            else if(input == 3){
                serialNumberDetails = getCode(state.vars.account);
                if(serialNumberDetails){ 
                    state.vars.serialNumberDetails = JSON.stringify(serialNumberDetails);
                    serialNumbers = serialNumberDetails.reduce(function(result,current,index){ return result+ (index+1)+ ') '+current.serialNumber + '\n';},'');
                    global.sayText(translate('view_recent_code',{'$serialNumbers': serialNumbers},state.vars.shsLang));
                    global.promptDigits(getCodeSerialHandler.handlerName);
                }
                else if(serialNumberDetails != null)
                    global.sayText(translate('no_serial_message',{},state.vars.shsLang));
                global.stopRules();
            }
            else if(input == 4){
                global.sayText(state.vars.main_menu);
                global.promptDigits(state.vars.main_menu_handler);
            }
            else{
                global.sayText(translate('select_service',{},state.vars.shsLang));
                global.promptDigits(handlerName);
            }
        };
    }
};