var handlerName = 'registrationTypeHandler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var serialNumberHandler = require('../serial-number-handler/serialNumberHandler');
var translate =  createTranslator(translations, project.vars.lang);
var notifyELK = require('../../notifications/elk-notification/elkNotification');

module.exports = {
    handlerName: handlerName,
    getHandler: function(){
        return function(input){
            notifyELK();
            if(input == 1){
                global.sayText(translate('serial_number_request',{},state.vars.shsLang));
                global.promptDigits(serialNumberHandler.handlerName);
            }
            else{
                global.sayText(translate('register_serial_menu',{},state.vars.shsLang));
                global.promptDigits(handlerName);
            }

        };
    }

};