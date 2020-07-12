var translations = require('./translations');
var createTranslator = require('../utils/translator/translator');
var chickenEligibility = require('./chicken-eligibility/index');
var possibleOrderHandler = require('./possible-order-handler/index');
var placeOrderHandler = require('./place-order-handler/index');
var changeOrderHandler = require('./change-order-handler/index');
var changeOrderConfirmation = require('./change-order-confirmation/index');
var translate =  createTranslator(translations, project.vars.lang);

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
            var r1,r2;
            if(Date.parse(new Date()) > Date.parse(new Date('2020-08-01T00:00:00.00'))){
                console.log(new Date()+'-------------------------------------------');
                console.log(Date.parse(new Date()) < new Date('2020-08-01T00:00:00.00'));
                console.log(Date.parse(new Date()) > Date.parse((new Date('2020-08-01T00:00:00.00'))));
                r1 = 'true';
                r2 = 'false'; 
            }
            else{
                console.log(new Date()+'++++++++++++++++++++++++++++++++');
                console.log(Date.parse((new Date()) > Date.parse((new Date('2020-08-01T00:00:00.00')))));
                console.log(Date.parse(new Date()) < Date.parse(new Date('2020-08-01T00:00:00.00')));
                r1 = 'false';
                r2 = 'true';
            }
            var chicken_table = project.initDataTableById(service.vars.chicken_table_id);
            var cursor = chicken_table.queryRows({'vars': {'account_number': state.vars.account_number}});
            if(cursor.hasNext()){
                var row = cursor.next();
                var code = row.vars.confirmation_code;
                row.vars.confirmed = 1;
                row.vars.first_name = JSON.parse(state.vars.client_json).FirstName;
                row.vars.last_name = JSON.parse(state.vars.client_json).LastName;
                row.vars.site = JSON.parse(state.vars.client_json).SiteName;
                row.vars.district = JSON.parse(state.vars.client_json).DistrictName;
                row.vars.group = JSON.parse(state.vars.client_json).GroupName;
                row.vars.ordered_chickens = state.vars.confirmed_number;
                row.vars.confirmed_chicken_in_R1 = r1;
                row.vars.confirmed_chicken_in_R2 = r2;
                row.save();
                var final_msg = translate('chicken_ordering_final_msg',{'$number': state.vars.confirmed_number ,'$code': code });
                global.sayText(final_msg);  
                var msg_route = project.vars.sms_push_route;
                project.sendMessage({ 'to_number': contact.phone_number, 'route_id': msg_route, 'content': final_msg }); 
            }
            else{
                var row = chicken_table.createRow({vars: {'account_number' : state.vars.account_number}});
                row.vars.confirmed = 1;
                row.vars.first_name = JSON.parse(state.vars.client_json).FirstName;
                row.vars.last_name = JSON.parse(state.vars.client_json).LastName;
                row.vars.site = JSON.parse(state.vars.client_json).SiteName;
                row.vars.district = JSON.parse(state.vars.client_json).DistrictName;
                row.vars.group = JSON.parse(state.vars.client_json).GroupName;
                row.vars.ordered_chickens = state.vars.confirmed_number;
                row.vars.confirmed_chicken_in_R1 = r1;
                row.vars.confirmed_chicken_in_R2 = r2;
                var final_msg = translate('chicken_ordering_final_msg',{'$number': state.vars.confirmed_number ,'$code': 'CODE' });
                global.sayText(final_msg);  
                var msg_route = project.vars.sms_push_route;
                project.sendMessage({ 'to_number': contact.phone_number, 'route_id': msg_route, 'content': final_msg }); 
                row.vars.new_client = 'true';
                row.save();
            }

        }
        addInputHandler(possibleOrderHandler.handlerName, possibleOrderHandler.getHandler(onOrderingConfirmed));
        addInputHandler(placeOrderHandler.handlerName, placeOrderHandler.getHandler(onPaymentValidated));
        addInputHandler(changeOrderHandler.handlerName, changeOrderHandler.getHandler(onPaymentValidated));
        addInputHandler(changeOrderConfirmation.handlerName, changeOrderConfirmation.getHandler(onOrderFinalized));
    },

    start: function (account, country) {
        state.vars.account = account;
        state.vars.country = country;
        var chicken_table = project.initDataTableById(service.vars.chicken_table_id);
        chickenEligibility(chicken_table, state.vars.account,JSON.parse(state.vars.client_json)); 
        if((state.vars.chcken_nber == 0) || state.vars.client_notfound ){
            global.sayText(translate('chicken_place_order'));
            global.promptDigits(placeOrderHandler.handlerName);
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
            global.sayText(translate('chicken_possible_nber',{'$name': JSON.parse(state.vars.client_json).FirstName,'$min': 2,'$max': state.vars.max_chicken}));
            global.promptDigits(possibleOrderHandler.handlerName);
        }

        else{
            global.sayText(translate('try_later',{}));
            global.stopRules();
            return;
        }
    }
};
