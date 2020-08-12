var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');
var translate =  createTranslator(translations,state.vars.reg_lang || 'en-ke');
var handlerName = 'group_leader_question_handler';
var notifyELK = require('../../notifications/elk-notification/elkNotification');
module.exports = {
    handlerName: handlerName,
    getHandler: function(onGroupLeaderQuestion){
        return function (input) {
            notifyELK();
            if(input == 1){
                state.vars.groupLeader = 1;
                onGroupLeaderQuestion(input);
            }
            else if(input == 2 ){
                state.vars.groupLeader = 0;
                onGroupLeaderQuestion(input);
            }
            else{
                global.sayText(translate('reg_group_leader_question',{},state.vars.reg_lang));
                global.promptDigits(handlerName);
            }
        };
    }
};