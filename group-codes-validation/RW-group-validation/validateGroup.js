
module.exports = function (groupCode,groupCodesTableId){
    var table = project.initDataTableById(groupCodesTableId);
    var cursor = table.queryRows({vars: {'groupId': groupCode}});
    if(cursor.hasNext()){
        return true;
    }else{
        return false;
    }
};