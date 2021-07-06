
module.exports = function (client){
    var districtName, sectorName;
    console.log('d'+ client.DistrictName);
    var clientTable = project.initDataTableById(service.vars.chicken_table_id);
    var clientCursor = clientTable.queryRows({'vars': {'account_number': client.AccountNumber, 'district': client.DistrictName}});
    if(!clientCursor.hasNext()){
        state.vars.client_notfound = true;
        return false;
    }
    else{
        var clientRow = clientCursor.next();
        districtName = clientRow.vars.district; 
        sectorName = clientRow.vars.sector;
    }
    var getCapsBySector = require('./getCapsBySector');
    var capsDetails = getCapsBySector(districtName, sectorName);
    var caps;
    if(capsDetails){ caps = capsDetails.chicken_cap;}
    var month = new Date().getMonth()+1;
    if(caps){
        /* will be accessed to check the delivery window since it is a property of this object
        currently being used in ~chicken-services/change-order-confirmation/changeOrderConfirmation */
        state.vars.capsDetails = JSON.stringify(capsDetails); 
        
        var numberOfChickensInTheMonth = 0;
        var table = project.initDataTableById(service.vars.chicken_table_id);
        var cursor = table.queryRows({'vars': {'confirmed': 1, 'confirmed_month': month, 'district': districtName, 'sector': sectorName}});
        while(cursor.hasNext())
        {
            var row = cursor.next();
            numberOfChickensInTheMonth = parseInt(row.vars.ordered_chickens) + parseInt(numberOfChickensInTheMonth);
        }
        console.log('chickens:'+ numberOfChickensInTheMonth);
        if((numberOfChickensInTheMonth - caps) >= -1){
            return false;
        }
        else{
            return (caps - numberOfChickensInTheMonth);
        }
    }
    state.vars.client_notfound = true;
    return false;
};