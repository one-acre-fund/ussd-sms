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

var lang = contact.vars.lang || 'bu';
var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var getMessage = translator(translations, lang);
var registerInputHandlers = require('./inputHandlers/registerInputHandlers');
var onAccountNumberValidated = require('./utils/onAccountNumberValidated');
var splashInputHandler = require('./inputHandlers/splashInputHandler');

service.vars.server_name = project.vars[env+'_server_name'];
service.vars.roster_api_key = project.vars[env+'_roster_api_key'];

global.main = function() {
    sayText(getMessage('splash', {}, lang));
    promptDigits(splashInputHandler.handlerName);
};

registerInputHandlers(lang, onAccountNumberValidated);