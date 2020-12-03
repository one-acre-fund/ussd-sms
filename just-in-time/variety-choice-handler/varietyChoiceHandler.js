var handlerName = 'variety_choice_handler';

var notifyELK = require('../../notifications/elk-notification/elkNotification');
var chosenInput = [];
function isValidBundleInput(input, bundleInputs){
    
    chosenInput = bundleInputs[input-1];
    if((chosenInput) && (chosenInput.length != 0)){
        return true;
    }
    return false;

}
function getBundlesInputs(districtId){
    var table = project.initDataTableById(service.vars.topUpBundleTableId);
    var bundleInputs = [];
    var query = {};
    query['d' + districtId] = 1;
    query.offered = 1;
    var cursor = table.queryRows({'vars': query});
    while(cursor.hasNext()){
        var row = cursor.next();
        var currentBundleInput = {bundleId: row.vars.bundleId, bundleInputId: row.vars.bundleInputId,'en-ke': row.vars.en, sw: row.vars.sw, bundleName: row.vars.bundle_name, price: row.vars.price, inputName: row.vars.input_name};
        bundleInputs.push(currentBundleInput);
    }
    return bundleInputs;
}
module.exports = {
    handlerName: handlerName,
    getHandler: function(onVarietyChosen){
        return function (input) {
            var bundleInputs = getBundlesInputs(state.vars.currentDistrict);
            var selectedBundle = [];
            for( var i = 0; i < bundleInputs.length; i++ ){
                if( bundleInputs[i].bundleId == state.vars.varietyBundleId){
                    selectedBundle.push(bundleInputs[i]);
                }
            }
            var varietyStockTable = project.initDataTableById(service.vars.varietyStockTableId);
            var allVarieties =[];
            selectedBundle.forEach(function(element){
                var stockCursor = varietyStockTable.queryRows({vars: {'warehousename': state.vars.varietyWarehouse,'inputname': element.inputName}});
                if(stockCursor.hasNext()){
                    var row = stockCursor.next();
                    if(row.vars.quantityavailable > row.vars.quantityordered){
                        allVarieties.push(element);
                    }
                }
            });
            notifyELK();
            if (state.vars.multiple_input_menus) {
                if (input == 44 && state.vars.input_menu_loc > 0) {
                    state.vars.input_menu_loc = state.vars.input_menu_loc - 1;
                    var menu = JSON.parse(state.vars.input_menu)[state.vars.input_menu_loc];
                    global.sayText(menu);
                    global.promptDigits(handlerName);
                    return null;
                }
                else if (input == 77 && (state.vars.input_menu_loc < state.vars.input_menu_length - 1)) {
                    state.vars.input_menu_loc = state.vars.input_menu_loc + 1;
                    menu = JSON.parse(state.vars.input_menu)[state.vars.input_menu_loc];
                    global.sayText(menu);
                    global.promptDigits(handlerName);
                    return null;
                }
            }
            if(isValidBundleInput(input, allVarieties)){
                onVarietyChosen(chosenInput);
            }
        };
    }
};