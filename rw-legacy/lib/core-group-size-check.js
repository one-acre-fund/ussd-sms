// Module to return true if clients registered in a group is less than 16
module.exports = function(groupId, clientTable){

    var cursor = clientTable.queryRows({'vars' : {'glus' : groupId}});
    if(cursor.count() >= 16){
        return false;
    }
    else{
        return true;
    }
};