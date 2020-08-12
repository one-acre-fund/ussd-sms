
module.exports = function receptionHandler(input) {
    var lang = state.vars.lang;
    var translations = require('../translations/index');
    var translator = require('../../../utils/translator/translator');
    var getMessage = translator(translations, lang);
    var farmer = JSON.parse(state.vars.selected_farmer);
    var farmers_table = project.initDataTableById(service.vars.ExtensionFarmers);
    var all_farmers_table = project.initDataTableById(service.vars.extensionTableId);
    var farmer_row = farmers_table.queryRows({
        vars: {'national_id': farmer.national_id}
    });
    var farmer_row_in_all_farmers_table = all_farmers_table.queryRows({
        vars: {'national_id': farmer.national_id}
    });
    var nextedRow,allFarmersTablerow;
    if(input == 1) {
        if(farmer_row.hasNext()) {
            nextedRow = farmer_row.next();
            nextedRow.vars.received_tester_pack = true;
            nextedRow.save();
        }
        if(farmer_row_in_all_farmers_table.hasNext()) {
            allFarmersTablerow = farmer_row_in_all_farmers_table.next();
            allFarmersTablerow.vars.client_received_tester_pack = 'yes';
            if(allFarmersTablerow.vars.time_created_confirmation == null || allFarmersTablerow.vars.time_created_confirmation == undefined){
                allFarmersTablerow.vars.time_created_confirmation = new Date().toString();
            }
            allFarmersTablerow.vars.last_updated_confirmation = new Date().toString();
            allFarmersTablerow.save();
        }
    } else if(input == 2) {
        if(farmer_row.hasNext()) {
            nextedRow = farmer_row.next();
            nextedRow.vars.received_tester_pack = false;
            nextedRow.save();
        }
        if(farmer_row_in_all_farmers_table.hasNext()) {
            allFarmersTablerow = farmer_row_in_all_farmers_table.next();
            allFarmersTablerow.vars.client_received_tester_pack = 'no';
            if(allFarmersTablerow.vars.time_created_confirmation == null || allFarmersTablerow.vars.time_created_confirmation == undefined ){
                allFarmersTablerow.vars.time_created_confirmation = new Date().toString();
            }
            allFarmersTablerow.vars.last_updated_confirmation = new Date().toString();
            allFarmersTablerow.save();
        }
    } else {
        sayText(getMessage('invalid_input', {'$Menu': getMessage('confirm_reception', {}, lang)}, lang));
        promptDigits('confirm_reception', {
            timeout: 5,
            maxDigits: 2,
            submitOnHash: false
        });
    }
    stopRules();
};
