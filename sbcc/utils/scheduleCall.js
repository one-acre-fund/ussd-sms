var CallBackTimeCheck = require('../../contact-call-center/utils/callBackTimeCheck');
var translations = require('../translations/message-translations');
var translator = require('../../utils/translator/translator');
var Log = require('../../logger/elk/elk-logger');
var create_zd_ticket = require('../../zd-legacy/lib/create-ticket');

module.exports = function(callInfo) {
    var logger = new Log();
    var getMessage = translator(translations, callInfo.lang);

    if (CallBackTimeCheck(callInfo.accountNumber, callInfo.desc, 24)) {
        global.sayText(getMessage('call_back_duplicate', {}, callInfo.lang));
        global.stopRules();
    }
    else{
        var ticketTags = [callInfo.desc, 'kenya', 'CallBackUSSD'];
        if (create_zd_ticket(callInfo.accountNumber, callInfo.desc, callInfo.phoneNumber, ticketTags)){
            console.log('created_ticket!');
            global.sayText(getMessage(callInfo.successMsg, {}, callInfo.lang));
            global.stopRules();
        } else {
            logger.error('zendesk ticket creation failed for' + callInfo.accountNumber, {
                tags: ['zendesk', 'ke-legacy', callInfo.desc],
                data: {
                    reportedIssue: callInfo.desc,
                    phone: callInfo.phoneNumber,
                    requester: callInfo.accountNumber, 
                }
            });
            console.log('create_ticket failed on ' + callInfo.accountNumber);
            global.sayText(getMessage(callInfo.repeatMenu));
            global.promptDigits(callInfo.repeatHandler);
        }
    }
};