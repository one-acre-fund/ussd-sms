var translations = require('./translations');
var createTranslator = require('../utils/translator/translator');
var chickenEligibility = require('./chicken-eligibility/chickenEligibility');
var possibleOrderHandler = require('./possible-order-handler/possibleOrderHandler');
var placeOrderHandler = require('./place-order-handler/placeOrderHandler');
var changeOrderHandler = require('./change-order-handler/changeOrderHandler');
var changeOrderConfirmation = require('./change-order-confirmation/changeOrderConfirmation');
var translate =  createTranslator(translations, project.vars.cor_lang);
var notifyELK = require('../notifications/elk-notification/elkNotification'); 

module.exports = {
    registerHandlers: function (){
        function onPaymentValidated(){
            global.sayText(translate('chicken_possible_nber',{'$name': JSON.parse(state.vars.client_json).FirstName,'$min': 2, '$max': state.vars.max_chicken}));
            global.promptDigits(possibleOrderHandler.handlerName);
        }
        function onOrderingConfirmed(){
            global.sayText(translate('chicken_final_confrm',{'$number': state.vars.confirmed_number,'$price': (state.vars.confirmed_number * 2400)}));
            global.promptDigits(changeOrderConfirmation.handlerName);
        }
        function onOrderFinalized(){
            
            var chicken_table = project.initDataTableById(service.vars.chicken_table_id);
            var cursor = chicken_table.queryRows({'vars': {'account_number': state.vars.account_number}});
            var row, final_msg, msg_route;
            if(cursor.hasNext()){
                row = cursor.next();
                var code = row.vars.confirmation_code;
                row.vars.confirmed = 1;
                row.vars.first_name = JSON.parse(state.vars.client_json).FirstName;
                row.vars.last_name = JSON.parse(state.vars.client_json).LastName;
                row.vars.site = JSON.parse(state.vars.client_json).SiteName;
                row.vars.district = JSON.parse(state.vars.client_json).DistrictName;
                row.vars.group = JSON.parse(state.vars.client_json).GroupName;
                row.vars.ordered_chickens = state.vars.confirmed_number;
                row.vars.confirmed_chicken_in_R1 = 'false';
                row.vars.confirmed_chicken_in_R2 = 'true';
                row.vars.confirmed_month = new Date().getMonth() + 1;
                row.save();
                final_msg = translate('chicken_ordering_final_msg',{'$number': state.vars.confirmed_number ,'$code': code });
                global.sayText(final_msg);  
                msg_route = project.vars.sms_push_route;
                project.sendMessage({ 'to_number': contact.phone_number, 'route_id': msg_route, 'content': final_msg }); 
            }

        }
        addInputHandler(possibleOrderHandler.handlerName, possibleOrderHandler.getHandler(onOrderingConfirmed));
        addInputHandler(placeOrderHandler.handlerName, placeOrderHandler.getHandler(onPaymentValidated));
        addInputHandler(changeOrderHandler.handlerName, changeOrderHandler.getHandler(onPaymentValidated));
        addInputHandler(changeOrderConfirmation.handlerName, changeOrderConfirmation.getHandler(onOrderFinalized));
    },

    start: function (account, country) {
        notifyELK();
        state.vars.account = account;
        state.vars.country = country;
        var chicken_table = project.initDataTableById(service.vars.chicken_table_id);
        chickenEligibility(chicken_table, state.vars.account,JSON.parse(state.vars.client_json)); 
        if((state.vars.chcken_nber == 0) || state.vars.client_notfound ){
            global.sayText(translate('chicken_confirmation_not_allowed'));
            global.stopRules();
        }

        else if(state.vars.confirmed_chicken){
            global.sayText(translate('chicken_already_confirmed',{'$name': JSON.parse(state.vars.client_json).FirstName,'$number': state.vars.chcken_nber}));
            global.promptDigits(changeOrderHandler.handlerName);
        }
        else if(state.vars.minimum_amount_paid == false){
            global.sayText(translate('chicken_no_minimum_prepayment'));
            stopRules();
            return;   
        }
        else if(state.vars.minimum_amount_paid){
            console.log('minimum paid');
            var CheckChickenCapByDistrict = require('./check-chicken-cap-by-district/CheckChickenCapByDistrict');
            var possibleChickensPerDistrict = CheckChickenCapByDistrict(JSON.parse(state.vars.client_json).DistrictId,new Date().getMonth() + 1);
            console.log('possible Chickens'+ possibleChickensPerDistrict);
            if(!possibleChickensPerDistrict){
                console.log('cap reached');
                global.sayText(translate('chicken_cap_reached'));
                stopRules();
                return; 
            }
            else{
                console.log('okay to go');
                global.sayText(translate('chicken_possible_nber',{'$name': JSON.parse(state.vars.client_json).FirstName,'$min': 2,'$max': state.vars.max_chicken}));
                global.promptDigits(possibleOrderHandler.handlerName);
            }            
        }

        else{
            console.log('try later');
            global.sayText(translate('try_later',{}));
            global.stopRules();
            return;
        }
    }
 
};