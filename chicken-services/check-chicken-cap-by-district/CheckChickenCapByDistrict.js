
var capsByDistrict = require('./capsByDistrict');
module.exports = function (district, month){

    var caps = capsByDistrict[district][month];
    console.log('districtId:'+district+ 'month:'+ month);
    console.log('number of caps:'+ caps);
    if(caps){
        var numberOfChickensInTheMonth = 0;
        var table = project.initDataTableById(service.vars.chicken_table_id);
        var cursor = table.queryRows({'vars': {'confirmed': 1, 'confirmed_month': month}});
        while(cursor.hasNext())
        {
            var row = cursor.next();
            numberOfChickensInTheMonth = parseInt(row.vars.ordered_chickens) + parseInt(numberOfChickensInTheMonth);
            console.log('number to add:'+row.vars.ordered_chickens );
        }
        console.log('chickens:'+ numberOfChickensInTheMonth);
        if((numberOfChickensInTheMonth - caps) >= -1){
            console.log('failed because:'+(numberOfChickensInTheMonth - caps));
            return false;
        }
        else{
            console.log('pased because:'+(caps - numberOfChickensInTheMonth));
            return (caps - numberOfChickensInTheMonth);
        }
    }
    console.log(numberOfChickensInTheMonth);
    return false;
};