var handlerName = 'place_chicken_order';
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');
var translate =  createTranslator(translations, project.vars.cor_lang);
var avocadoEligibility = require('../avocado-eligibility/avocadoEligibility');

function isOrderEligible(input){
    var avocado_table = project.initDataTableById(service.vars.chicken_table_id);
    var eligibility = avocadoEligibility(avocado_table, state.vars.account,JSON.parse(state.vars.client_json));
    if(eligibility){
        if(input <= eligibility.possibleTrees){
            return true;
        }
    }
    return false;
}
module.exports = {
    handlerName: handlerName,
    getHandler: function(onOrderPlaced){

        return function(input){
            notifyELK();
            if(input < 3){
                global.sayText(translate('mimimun_not_reached',{},state.vars.lang));
                global.promptDigits(handlerName);
            }
            else if(isOrderEligible(input)){
                onOrderPlaced(input);
            }
            else{
                global.sayText(translate('order_not_eligible',{'$number': input},state.vars.lang));
                global.stopRules();
            }
        };

    }
};