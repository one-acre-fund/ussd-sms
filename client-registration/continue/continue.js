var notifyELK = require('../../notifications/elk-notification/elkNotification');
var handlerName = 'continue_enrollment';

var getWarehouse = function(districtName){
    var table  = project.initDataTableById(service.vars.districtWarehouseTableId);
    var cursor = table.queryRows({vars: {'districtname': districtName}});
    if(cursor.hasNext()){
        var row = cursor.next();
        var varietyTable = project.initDataTableById(service.vars.districtVarietyTableId);
        var varietyWarehouseCursor = varietyTable.queryRows({vars: {'districtname': districtName}});
        if(varietyWarehouseCursor.hasNext()){
            var varietyRow = varietyWarehouseCursor.next();
            state.vars.varietyWarehouse = varietyRow.vars.warehouse;
        }
        return row.vars.warehouse;
    }
    else{
        return false;
    }
};
module.exports = {
    handlerName: handlerName,
    getHandler: function(onContinueToEnroll){
        return function (input) {  
            notifyELK();
            if(input == 1){
                state.vars.warehouse = getWarehouse(JSON.parse(state.vars.client_json).DistrictName);
                if(state.vars.warehouse != false){ 
                    onContinueToEnroll();
                }
            }
            else{
                stopRules();
            }
        };
    }
};