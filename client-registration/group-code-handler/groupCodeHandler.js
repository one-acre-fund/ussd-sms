
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

var handlerName = 'group_code_handler';
var notifyELK = require('../../notifications/elk-notification/elkNotification');
var createTranslator = require('../../utils/translator/translator');
var translations = require('../translations');
var translate =  createTranslator(translations, project.vars.lang);
module.exports = {
    handlerName: handlerName,
    getHandler: function(onGroupCodeValidated){
        return function (input) {
            notifyELK();
            //if the user forgot the leading zero
            if((input.replace(/\W/g, '')).length != 13){
                input = '0'+ input;
            }
            var groupInfo = parse_gid(input);
            if(isNaN(groupInfo.districtId) || isNaN(groupInfo.siteId) || isNaN(groupInfo.groupId)){
                global.sayText(translate('enter_group_code',{},state.vars.reg_lang));
                global.promptDigits(handlerName);
                
            }
            else{
                onGroupCodeValidated(groupInfo);
            }
        };
    }
};