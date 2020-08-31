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

service.vars.server_name = project.vars[env + '_server_name'];
service.vars.roster_api_key = project.vars[env + '_roster_api_key'];
service.vars.roster_read_key = project.vars.roster_read_key;

var translations = require('./translations/index');
var translator = require('../utils/translator/translator');
var lang = project.vars.lang;
var getMessage = translator(translations, lang);

global.main = function() {
    var changeLang = getMessage('splash', {}, lang);
    var splashMenu = changeLang + getMessage('lang', {}, lang);
    sayText(splashMenu);
    promptDigits('account_number', {
        maxDigits: 8,
        submitOnHash: false,
    });
};
