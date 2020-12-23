var CallBackTimeCheck = require('../../contact-call-center/utils/callBackTimeCheck');
var translations = require('../translations/message-translations');
var translator = require('../../utils/translator/translator');
var Log = require('../../logger/elk/elk-logger');
var create_zd_ticket = require('../../zd-legacy/lib/create-ticket');

module.exports = function(lang, desc, userDetails, menu) {
    var logger = new Log();
    var getMessage = translator(translations, lang);

    if (CallBackTimeCheck(userDetails.accountNumber, desc, 48)) {
        global.sayText(getMessage('call_back_duplicate', {}, lang));
        global.stopRules();
    }
    else{
        var ticketTags = [desc, 'kenya', 'CallBackUSSD'];
        if (create_zd_ticket(userDetails.accountNumber, desc, userDetails.phoneNumber, ticketTags)){
            console.log('created_ticket!');
            global.sayText(getMessage('OAF_call', {}, lang));
            global.stopRules();
        } else {
            logger.error('zendesk ticket creation failed for' + userDetails.accountNumber, {
                tags: ['zendesk', 'ke-legacy', desc],
                data: {
                    reportedIssue: desc,
                    phone: userDetails.phoneNumber,
                    requester: userDetails.accountNumber, 
                }
            });
            console.log('create_ticket failed on ' + userDetails.accountNumber);
            global.sayText(getMessage(menu));
            global.promptDigits(menu);
        }
    }
};