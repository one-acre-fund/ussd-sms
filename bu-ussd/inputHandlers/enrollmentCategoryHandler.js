
var translator = require('../../utils/translator/translator');
var translations = require('../translations/index');
var groupCodeHandler = require('./groupCodeHandler');
var handlerName = 'bu_pre_enrol_cat_handler';
var preEnrollmentHandler = require('./preEnrollmentHandler');
var notifyELK = require('../../notifications/elk-notification/elkNotification');

module.exports = {
    handlerName: handlerName,
    getHandler: function(lang) {
        return function(input) {
            notifyELK();
            var getMessage = translator(translations, lang);
            if(input == 1) {
                state.vars.sameGroup = 'true';
                console.log('#before'+ state.vars.sameGroup);
                console.log('then here');
                //ask for the account number to enroll
                global.sayText(getMessage('account_to_be_enrolled'));
                global.promptDigits(preEnrollmentHandler.handlerName);
            }
            else if(input == 2) {
                state.vars.sameGroup = 'false';
                //Ask for group code
                global.sayText(getMessage('group_code_msg'));
                global.promptDigits(groupCodeHandler.groupCodeHandler); 
            }
            else {
                global.sayText(getMessage('enrollment_category'));
                global.promptDigits(handlerName);
            }
        };

    }
};