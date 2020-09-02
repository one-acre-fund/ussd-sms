var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var cropsHandler = require('./inputHandlers/cropsInputHandler');
var varietiesHandler = require('./inputHandlers/varietiesInputHandler');
var kgsInputHandler = require('./inputHandlers/kgsInputHandler');
var phoneNumberInputHandler = require('./inputHandlers/phoneNumberHandler');

var crops = {'1': 'Groundnuts', '2': 'Rice', '3': 'Pigeon peas'};

function registerInputHandlers(){
    addInputHandler(cropsHandler.handlerName, cropsHandler.Handler);
    addInputHandler(varietiesHandler.handlerName, varietiesHandler.handler);
    addInputHandler(kgsInputHandler.handlerName, kgsInputHandler.handler);
    addInputHandler(phoneNumberInputHandler.handlerName, phoneNumberInputHandler.handler);
}

/**
 * Starts the buyback transaction record
 * @param {Object} client client object with details of a farmer in the session 
 */
function start(client){
    var lang = state.vars.lang;
    var getMessage = translator(translations, lang);
    state.vars.crops = JSON.stringify(crops);
    state.vars.account_number = client.AccountNumber;
    state.vars.first_name = client.FirstName;
    state.vars.last_name = client.LastName;
    state.vars.client_name = client.ClientName;
    state.vars.current_season = JSON.stringify(client.BalanceHistory[0]);
    var cropsMenu = getMessage('crops', {}, lang);
    sayText(cropsMenu);
    promptDigits(cropsHandler.handlerName, {
        submitOnHash: false,
        timeout: 5,
        maxDigits: 1
    });
}

module.exports = {
    start: start,
    registerInputHandlers: registerInputHandlers 
};
