var handlerName = 'shs_menu_handler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var serialNumberHandler = require('../serial-number-handler/serialNumberHandler');
var getSerialNumber = function(){
    //TODO: get serial number given OFID account
    //return array of serial number, type given oafiID

};

function getRecentActivationCode(){
    //Check Roster for the recent activation/unlock code

    //Returns activation code
}
module.exports = {
    handlerName: handlerName,
    getHandler: function(onMenuChosen,onSerialValidated){
        return function (input) {
            if(input == 1){
                //TODO: check if client placed an order of shs unit
                global.sayText(translate('serial_number-request',{},state.vars.shsLang));
                global.promptDigits(serialNumberHandler);
            }else if(input == 2){
                var serialNumber = getSerialNumber();
                if(serialNumber){
                    if(serialNumber.length == 1){
                        onSerialValidated(serialNumber);
                    }
                    else{
                        global.sayText(translate('serial_number-request',{},state.vars.shsLang));
                        global.promptDigits(serialNumberHandler);
                    }
                }
            }else if(input == 3){
                var mostRecentCode = getRecentActivationCode();
                if(mostRecentCode){
                    if(mostRecentCode == 1){
                        global.sayText(translate('recent_code',{'$code': mostRecentCode},state.vars.shsLang));
                        global.stopRules();
                    }
                    else{
                        state.vars.action = 'activation';
                        global.sayText(translate('serial_number-request',{},state.vars.shsLang));
                        global.promptDigits(serialNumberHandler);
                    }
                }
                else{
                    global.sayText(translate('no_recent_code',{},state.vars.shsLang));
                    global.stopRules();
                }

            }else if(input == 4){
                onMenuChosen(4);
            }

        };

    }


};