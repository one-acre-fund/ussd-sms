var handlerName = 'accountNumberHandler';
var translations = require('../translations');
var createTranslator = require('../../utils/translator/translator');
var shsMenuHandler = require('../shs-menu-handler/shsMenuHandler');
var translate =  createTranslator(translations, project.vars.lang);
var roster = require('../../rw-legacy/lib/roster/api');
var notifyELK = require('../../notifications/elk-notification/elkNotification');


var TrimClientJSON = function(client){
    var SeasonCount = client.BalanceHistory.length;
    if (SeasonCount>3){client.BalanceHistory.length = 3;}
    return client;
};


module.exports = {
    handlerName: handlerName,
    getHandler: function(){
        return function(input){
            notifyELK();
            state.vars.account = input;
            if(roster.authClient(state.vars.account,state.vars.country)){
                var client = roster.getClient(input,state.vars.country);
                if(client){
                    state.vars.client = JSON.stringify(TrimClientJSON(client));
                    state.vars.other = 'true';
                    console.log('###########client'+state.vars.client);
                    if(client.BalanceHistory.length > 0){
                        var gl = JSON.parse(state.vars.gLClient);
                        console.log('###########client'+state.vars.client);
                        if(client.GroupId == gl.GroupId && client.DistrictID == gl.DistrictID && client.SiteID == gl.SiteID ){
                            if(client.BalanceHistory[0].SeasonName != '2021, Long Rain'){
                                global.sayText(translate('not_enrolled',{},state.vars.shsLang));
                                global.stopRules();
                            }
                            global.sayText(translate('select_service',{},state.vars.shsLang));
                            global.promptDigits(shsMenuHandler.handlerName); 
                        }
                        else{
                            global.sayText(translate('different_group',{},state.vars.shsLang));
                            global.stopRules();
                        } 
                    } 
                }
                
            }
            else{
                global.sayText(translate('invalid_account',{},state.vars.shsLang));
                global.promptDigits(handlerName);
            }
        };
    }

};