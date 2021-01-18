var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var handlerName = 'dateAvailableHandler';

function isValidDate(date){
    var separatedDate = date.split('/');
    console.log('##########################'+separatedDate);
    if(separatedDate.length == 3){
        console.log('##########################'+parseInt(separatedDate[0],10) +' '+parseInt(separatedDate[1],10)+' '+parseInt(separatedDate[2],10));
        console.log('-----------------------------'+ (0 < parseInt(separatedDate[0],10)<= 31));
        if((0 < parseInt(separatedDate[0],10) && parseInt(separatedDate[0],10)<= 31) && (0 < parseInt(separatedDate[1],10) && parseInt(separatedDate[1],10) <=12) && (2020 > parseInt(separatedDate[2],10)))
            return true;
    }
    return false;
}
module.exports = {
    handlerName: handlerName,
    getHandler: function(onDateSubmitted){
        return function(input){
            if(input && isValidDate(input)){
                onDateSubmitted(input);
            }
            else{
                var translate =  createTranslator(translations, state.vars.marketLang);
                global.sayText(translate('maize_availability',{}));
                global.promptDigits(handlerName);
            }   
        };
    }
};
