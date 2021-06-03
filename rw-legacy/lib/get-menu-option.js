/*
function for returning menu options from a given option menu
*/

var getDistrictBundles = require('../dat/district-bundles');

module.exports = function(menu_option, menu_table,districtId){
    var districtBundles = getDistrictBundles();
    console.log('district bundles:  ' + JSON.stringify({bundles: districtBundles}))
    // If the user is a group leader
    if(!menu_option){
        return null;
    }
    console.log('>> menu table' + menu_table + '\nproduct_menu_table_name: ' + state.vars.product_menu_table_name)
    if(menu_table === state.vars.product_menu_table_name){
        console.log('###################################okay');
        var selections = districtBundles.filter(function (row) {
            return row.option_number == menu_option;
        });
        
        //console.log('###################################'+ selections.length + '#############'+JSON.stringify(selections[0]));
        //console.log('###################################okay'+JSON.stringify(districtBundles));
        if ((selections.length === 0)) {
            return null;
        }
        var option = selections[0];
        console.log('############################# '+ JSON.stringify(option)+'#################');
        console.log('££££'+districtId + '$$$');
        if (districtId) {
            if (option['d' + districtId] != 1) {
                console.log('nothing inside d'+districtId);
                return null;
            }
            console.log('####inside district');
        }
        if (selections.length > 1) {
            console.log('greater than 1');
            var admin_alert = require('./admin-alert');
            admin_alert('Error in retrieving menu option - duplicate options\n' + '\nOption number : ' + menu_option);
            //throw 'ERROR: Duplicate options - Table name : ' + menu_table + ' - Option number : ' + menu_option;
        }
        var outstr = option.option_name || option.bundle_name || option.input_name;
        console.log('options: '+option.option_name + 'and'+ option.bundle_name + 'and' + option.input_name);
        console.log('@@@@'+outstr);
        return outstr;
        
    }else {

        var table = project.getOrCreateDataTable(menu_table);
        var cursor = table.queryRows({'vars': {'option_number': menu_option}});
        if((!cursor.hasNext())){
            return null;
        }
        option = cursor.next();
        if(cursor.hasNext()){
            admin_alert = require('./admin-alert');
            admin_alert('Error in retrieving menu option - duplicate options\nTable name : ' + menu_table + '\nOption number : ' + menu_option);
            //throw 'ERROR: Duplicate options - Table name : ' + menu_table + ' - Option number : ' + menu_option;
        }
        outstr = option.vars.option_name || option.vars.bundle_name || option.vars.input_name;
        return outstr;
    }
};
