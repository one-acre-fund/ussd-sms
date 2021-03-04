var translations = require('../translations/index');
var translator = require('../../../utils/translator/translator');
var registerConfirmationInputHandler = require('./registerConfirmationInputHandler');

var handlerName = 'bu_reg_group_code';

module.exports = {
    handlerName: handlerName,
    getHandler: function(language) {
        return function(input) {
            var getMessage = translator(translations, language);

            function invalidGroupCode() {
                // invalid input. reprompt
                global.sayText(getMessage('invalid_group_code'));
                global.promptDigits(handlerName);
            }

            if(!input || !input.replace(/\D/g, '')) {
                invalidGroupCode();
                return;
            }

            if((input.replace(/\W/g, '')).length != 13){
                input = '0'+ input;
            }
            var groupInfo = parse_gid(input);
            if(isNaN(groupInfo.districtId) || isNaN(groupInfo.siteId) || isNaN(groupInfo.groupId)){
                invalidGroupCode();
                return;
                
            }
            else{
                // store the group information into the state variable for later use in api request for registration
                state.vars.group_info = JSON.stringify(groupInfo);
                global.sayText(getMessage('register_confirmation'));
                global.promptDigits(registerConfirmationInputHandler.handlerName);
            }

        };
    }
};



/*
0164602302345 // both siteId and groupId +ve
01646*02302345 // siteId -ve groupId +ve
01646023*02345 // siteId +ve groupId -ve
01646*023*02345// both siteId and groupId -ve
*/
function parse_gid(gid) {

    var districtId = parseInt(gid.slice(0,5),10);
    var siteId, groupId;
    var group_code = gid.replace(/\W/g, '-');
    if(group_code[5] == '-'){ //siteId is negative
        siteId = parseInt(group_code.slice(5,9), 10);
        groupId = parseInt(group_code.slice(9,group_code.length), 10); 
    }else{
        siteId = parseInt(group_code.slice(5,8), 10);
        groupId = parseInt(group_code.slice(8,group_code.length), 10);
    }

    return {
        districtId: districtId,
        siteId: siteId ,
        groupId: groupId,
        
    };
}