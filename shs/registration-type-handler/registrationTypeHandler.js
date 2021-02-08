var handlerName = 'registrationTypeHandler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var serialNumberHandler = require('../serial-number-handler/serialNumberHandler');
var translate =  createTranslator(translations, project.vars.lang);
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var replacementHandler = require('../replacement-handler/replacementHandler');
var getCode = require('../helper-functions/getCode');

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
                if((typeof(serialNumberDetails) === 'object' || _.isArray(serialNumberDetails))&& serialNumberDetails != null){
                    state.vars.serialNumberDetails = JSON.stringify(serialNumberDetails);
                    var serialNumbers = serialNumberDetails.reduce(function(result,current,index){ return result+ (index+1)+ ') '+current.serialNumber + '\n';},'');
                    global.sayText(translate('replacement_menu',{'$serialNumbers': serialNumbers},state.vars.shsLang));
                    global.promptDigits(replacementHandler.handlerName);
                }
                else if(serialNumberDetails != null)
                    global.sayText(translate('no_serial_message',{},state.vars.shsLang));
                global.stopRules();
            }
            else{
                global.sayText(translate('register_serial_menu',{},state.vars.shsLang));
                global.promptDigits(handlerName);
            }

        };
    }

};