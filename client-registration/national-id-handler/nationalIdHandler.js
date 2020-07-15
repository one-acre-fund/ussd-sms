var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');
var translate =  createTranslator(translations, project.vars.lang);

var isNationalIdValid= function(nId){
    var idLength = nId.length;
    
    //Different country have different national Id digits length
    if(state.vars.country ='ke'){
        if (idLength == 7 || idLength == 8){return true}
    }
    return false;
}

var handlerName = 'national_id_handler';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onNationalIdValidated){
        return function (input) {
            if(isNationalIdValid(input)){
                onNationalIdValidated(input);
            }
            else{
                global.sayText(translate('invalid_national_id',{},state.vars.reg_lang));
                global.promptDigits(handlerName);
            }

        };

    }
};