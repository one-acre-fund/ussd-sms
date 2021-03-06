
var defaultEnvironment;
if(service.active){
    defaultEnvironment = 'prod';
}else{
    defaultEnvironment = 'dev';
}

var env;
if(service.vars.env === 'prod' || service.vars.env === 'dev'){
    env = service.vars.env;
}else{
    env = defaultEnvironment;
}

var ValidateProjectVariables = require('./validateProjectVariables');
ValidateProjectVariables(env);

service.vars.server_name = project.vars[env + '_server_name'];
service.vars.roster_read_key = project.vars.roster_read_key;
service.vars.varieties_table = project.vars[env + '_varieties_table'];
service.vars.buyback_transactions_table = project.vars[env + '_buyback_transactions_table'];

var notifyELK = require('../notifications/elk-notification/elkNotification');
var lang = project.vars.lang;

state.vars.lang = lang;

var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var getMessage = translator(translations, lang);
var registerInputHandler = require('./inputHandlers/registerInputHandlers');
var accountNumberInputHandler = require('./inputHandlers/accountNumberInputHandler');
registerInputHandler(lang);

global.main = function(){
    notifyELK();
    sayText(getMessage('splash', {}, lang));
    promptDigits(accountNumberInputHandler.handlerName);
};
