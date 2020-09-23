var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');
var translate =  createTranslator(translations,  state.vars.reg_lang || 'en-ke');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

var isNationalIdValid= function(nId){
    var idLength = nId.length;
    //Different country have different national Id digits length
    if(state.vars.country == 'ke'){
        console.log('called true');
        if (idLength == 7 || idLength == 8){return true;}
    }
    else if(state.vars.country == 'RW'){
        if(idLength == 16){return true;}
    }
    console.log('called false');
    return false;
};

var handlerName = 'national_id_handler';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onNationalIdValidated){
        return function (input) {
            notifyELK();
            if(isNationalIdValid(input)){
                onNationalIdValidated(input);
            }
            else{
                global.sayText(translate('invalid_national_id'));
                global.promptDigits(handlerName);
            }

        };
    }
};