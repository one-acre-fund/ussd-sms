var handlerName = 'shs_type_handler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);

function getRecentActivationCode(serialTypes){
    //Check Roster for the recent activation/unlock code

    //Returns activation code 
    return serialTypes;
}

module.exports = {
    handlerName: handlerName,
    getHandler: function(onSerialValidated){
        return function(input){
            var serialTypes = JSON.parse(state.vars.serialTypes);
            if(input <= serialTypes.length){
                var serialType = serialTypes[0];
                if(state.vars.action == 'activation'){  
                    var mostRecentCode = getRecentActivationCode(serialTypes[0]);
                    if(mostRecentCode == 1){
                        global.sayText(translate('recent_code',{'$code': mostRecentCode},state.vars.shsLang));
                        global.stopRules();

                    }  

                }
                else{
                //TODO: register shs to account number
                    onSerialValidated(state.vars.serialNumber, serialType);
                }
            }
            else{
                var allSerialTypes = serialTypes.reduce(function(result,current,index){ return result+ (index+1)+ ') '+current + '\n';},'');
                global.sayText(translate('shs_type',{'$serialTypes': allSerialTypes},state.vars.shsLang));
                global.promptDigits(handlerName);

            }
        };

    }

};