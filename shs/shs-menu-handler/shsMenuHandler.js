var handlerName = 'shs_menu_handler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var registrationTypeHandler = require('../registration-type-handler/registrationTypeHandler');
var getCode = require('../helper-functions/getCode');
var getCodeSerialHandler = require('../get-code-serial-handler/getCodeSerialHandler');
var requestCodeHandler = require('../request-code-handler/requestCodeHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var shsNotification = require('../../notifications/elk-notification/shsNotification');
module.exports = {
    handlerName: handlerName,
    getHandler: function(){
        return function (input) {
            notifyELK('hello', true);
            if(input == 1){
                global.sayText(translate('register_serial_menu',{},state.vars.shsLang));
                global.promptDigits(registrationTypeHandler.handlerName);
            }else if(input == 2){
                state.vars.action = 'retreive-code';
                var serialNumberDetails = getCode(state.vars.account);
                if((typeof(serialNumberDetails) === 'object' || _.isArray(serialNumberDetails))&& serialNumberDetails != null){
                    state.vars.serialNumberDetails = JSON.stringify(serialNumberDetails);
                    var serialNumbers = serialNumberDetails.reduce(function(result,current,index){ return result+ (index+1)+ ') '+current.serialNumber + '('+current.unitType+')\n';},'');
                    global.sayText(translate('serial_numbers',{'$serialNumbers': serialNumbers},state.vars.shsLang));
                    global.promptDigits(requestCodeHandler.handlerName);
                }
                else if(serialNumberDetails != null){
                    var message = translate('no_code_message',{},state.vars.shsLang);
                    if(state.vars.unitForOther == 'true')
                        message = translate('no_code_message_client',{},state.vars.shsLang);
                    global.sayText(message);
                }
                global.stopRules();
            }
            else if(input == 3){
                serialNumberDetails = getCode(state.vars.account);
                if((typeof(serialNumberDetails) === 'object' || _.isArray(serialNumberDetails))&& serialNumberDetails != null){ 
                    state.vars.serialNumberDetails = JSON.stringify(serialNumberDetails);
                    serialNumbers = serialNumberDetails.reduce(function(result,current,index){ return result+ (index+1)+ ') '+current.serialNumber + '('+current.unitType+')\n';},'');
                    global.sayText(translate('view_recent_code',{'$serialNumbers': serialNumbers},state.vars.shsLang));
                    global.promptDigits(getCodeSerialHandler.handlerName);
                }
                else if(serialNumberDetails != null){
                    message = translate('no_code_message',{},state.vars.shsLang);
                    if(state.vars.unitForOther == 'true')
                        message = translate('no_code_message_client',{},state.vars.shsLang);
                    global.sayText(message);
                }
                //shsNotification(serialNumberDetails);
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