
var capsByDistrict = require('./capsByDistrict');
module.exports = function (district, month){

    var caps = capsByDistrict[district][month];
    if(caps){
        var numberOfChickensInTheMonth = 0;
        var table = project.initDataTableById(service.vars.chicken_table_id);
        var cursor = table.queryRows({'vars': {'confirmed': 1, 'confirmed_month': month}});
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
    return false;
};