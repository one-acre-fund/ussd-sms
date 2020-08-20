var translations = require('./translations/index');
var translator = require('../utils/translator/translator');

function registerInputHandlers(){
    var cropsInputHandler = require('./inputHandlers/cropsInputHandler');
    addInputHandler('crops', cropsInputHandler);
}

function start(){
    var lang = state.vars.lang;
    var getMessage = translator(translations, lang);
    state.vars.crops = JSON.stringify({'1': 'Groundnuts', '2': 'Rice', '3': 'Pigeon peas'});
    var crops = getMessage('crops', {}, lang);
    sayText(crops);
    promptDigits('crops', {
        submitOnHash: false,
        timeout: 5,
        maxDigits: 1
    });
}

module.exports = {
    start: start,
    registerInputHandlers: registerInputHandlers 
};
