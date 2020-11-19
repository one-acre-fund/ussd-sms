var CallBackTimeCheck = require('../utils/callBackTimeCheck');
var translations = require('../translations/index');
var translator = require('../../utils/translator/translator');
var Log = require('../../logger/elk/elk-logger');
var create_zd_ticket = require('../../zd-legacy/lib/create-ticket');

var handlerName = 'contact_call_center_ke';

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            var logger = new Log();
            var getMessage = translator(translations, lang);
            var userDetails = state.vars.client || JSON.stringify({AccountNumber: 'NonClient' + contact.phone_number});
            var client = JSON.parse(userDetails);
            var menu_options = JSON.parse(state.vars.ccc_options);
            var screens = JSON.parse(state.vars.ccc_screens);
            if(input in menu_options){
                var sub = 'Call back requested for: ' + menu_options[input] +' account number : '+ client.AccountNumber;
        
                if(CallBackTimeCheck(client.AccountNumber, sub, 48)){
                    global.sayText(getMessage('call_back_duplicate', {}, lang));
                    global.stopRules();
                }
                else{
                    var ticketTags = [menu_options[input], 'kenya', 'CallBackUSSD'];
                    if(create_zd_ticket(client.AccountNumber, sub, contact.phone_number, ticketTags)){
                        console.log('created_ticket!');
                        global.sayText(getMessage('call_back_confirm', {}, lang));
                        global.stopRules();
                    }
                    else{
                        logger.error('zendesk ticket creation failed for' + client.AccountNumber, {
                            tags: ['zendesk', 'ke-legacy', menu_options[input]],
                            data: {
                                reportedIssue: sub,
                                phone: contact.phone_number,
                                requester: client.AccountNumber, 
                            }
                        });
                        console.log('create_ticket failed on ' + client.AccountNumber);
                        global.sayText(screens[state.vars.ccc_current_screen]);
                        global.promptDigits(handlerName);
                    }
                }
            } else if(input == '77' && screens[state.vars.ccc_current_screen + 1]) {
                state.vars.ccc_current_screen += 1;
                global.sayText(screens[state.vars.ccc_current_screen]);
                global.promptDigits(handlerName);
            } else {
                global.sayText(screens[state.vars.ccc_current_screen]);
                global.promptDigits(handlerName);
            }
        };
    }
};
