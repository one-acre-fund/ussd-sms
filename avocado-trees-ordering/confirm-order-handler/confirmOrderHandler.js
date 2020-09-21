
var handlerName = 'confrm_order';
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var placeOrderHandler = require('../place-order-handler/placeOrderHandler');
var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');
var translate =  createTranslator(translations, project.vars.cor_lang);
module.exports = {
    handlerName: handlerName,
    getHandler: function(onOrderConfirmed){

        return function(input){
            notifyELK();
            if(input == 1){
                onOrderConfirmed();
            }
            else if(input == 2){
                var possibleTrees = JSON.parse(state.vars.possibleTrees);
                global.sayText(translate('eligible_repayment_message',{'$amount': possibleTrees.balance,'$number': possibleTrees.possibleTrees},state.vars.lang));
                global.promptDigits(placeOrderHandler.handlerName);
            }
            else if(input == 3){
                global.sayText(translate('order_not_finalized',{},state.vars.lang));
                global.stopRules();
            }
            else{
                global.sayText(translate('confirm_order',{'$number': state.vars.orderedNumber}, state.vars.lang));
                global.promptDigits(handlerName);
            }
        };

    }
};