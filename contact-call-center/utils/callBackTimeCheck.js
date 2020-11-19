module.exports = function(accountnumber, type, hours){
    var ticketTable = project.getOrCreateDataTable('CallBackUSSD');
    var cursor = ticketTable.queryRows({
        vars: {'account_number': accountnumber, 'call_category': type}
    });

    cursor.limit(1);
    if (cursor.hasNext()){
        var row = cursor.next();
        var now = moment().format('X');
        var hoursBetween = (now - row.time_created)/60/60;
        if (hoursBetween>hours){return false;}
        else { return true;}
    }
    else{return false;}

};