
module.exports = function receptionHandler(input) {
    var lang = state.vars.lang;
    var translations = require('../translations/index');
    var translator = require('../../../utils/translator/translator');
    var getMessage = translator(translations, lang);
    var farmer = JSON.parse(state.vars.selected_farmer);
    var farmers_table = project.initDataTableById(service.vars.ExtensionFarmers);
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
