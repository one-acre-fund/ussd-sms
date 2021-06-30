module.exports = function(districtId) {
    var table = project.initDataTableById(service.vars.endEnrollmentTableId);
    var cursor = table.queryRows({vars: {'district_id': districtId}});
    if(cursor.hasNext()) {
        row = cursor.next();
        if(moment(new Date()).utc().add(2,'hours') > moment.utc(row.vars.date_time)){
            return true;
        }
    }
    return false;
};