var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var translate =  createTranslator(translations, project.vars.lang);
var rosterAPI = require('../../rw-legacy/lib/roster/api');



module.exports = {
    isEnrolledInCurrentSeason: function(accountNumber, country){
        if(rosterAPI.authClient(accountNumber,country)){
            var client = rosterAPI.getClient(accountNumber,country);
            if(client){
                state.vars.shsClient = JSON.stringify(TrimClientJSON(client));
                if(client.BalanceHistory.length > 0){
                    if(client.BalanceHistory[0].SeasonName == '2021, Long Rain'){
                        return true;
                    }
                }
                
            }
            else{
                global.sayText(translate('error',{},state.vars.shsLang));
                global.stopRules();
            }
        }
        return false;
    }
        
};
var TrimClientJSON = function(client){
    var SeasonCount = client.BalanceHistory.length;
    if (SeasonCount>3){client.BalanceHistory.length = 3;}
    return client;
};