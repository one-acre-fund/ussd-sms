
module.exports = function receptionHandler(input) {
    var lang = state.vars.lang || 'en';
    state.vars.lang = lang;
    var farmer = JSON.parse(state.vars.selected_farmer);
    var farmers_table = project.initDataTableById('DTe1025290143442b5');
    var farmer_row = farmers_table.queryRows({
        vars: {'national_id': farmer.national_id}
    });
    var nextedRow;
    if(input == 1) {
        while(farmer_row.hasNext()) {
            nextedRow = farmer_row.next();
            nextedRow.vars.received_tester_pack = true;
            nextedRow.save();
        }
    } else if(input == 2) {
        while(farmer_row.hasNext()) {
            nextedRow = farmer_row.next();
            nextedRow.vars.received_tester_pack = false;
            nextedRow.save();
        }
    }
    stopRules();
};
