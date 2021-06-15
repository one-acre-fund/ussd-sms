/*
function for populating a USSD menu
takes as input a table + a lang
tables accessed by this function should have a field for each lang, plus an 'option_number' and 'option_name' field
option number is the numbered option that will apear in the menu
option name is the name of the response handler that will handle the selected option
*/

module.exports = function(table_name, lang, max_chars){
    var msgs = require('./msg-retrieve'); 
    var admin_alert = require('./admin-alert');
    var lang = lang || project.vars.lang;
    var console_lang = project.vars.console_lang;
    var prev_page = msgs('prev_page',{},lang);
    var next_page = msgs('next_page',{},lang);
    console.log(prev_page+'****************'+ next_page);
    
    if(prev_page == null || next_page == null){
        var lang = 'ki';
        var console_lang = 'en';
        console.log('error');
        admin_alert('Language not found\nError: ');

    } 
    max_chars = max_chars || 120;
    var output = '';
    var console_output = '';
    var menu_table = project.getOrCreateDataTable(String(table_name));
    var option_numbers = menu_table.countRowsByValue('option_number');
    var out_obj = {};
    var loc = 0;
    var clientDistrict = JSON.parse(state.vars.client_json)? JSON.parse(state.vars.client_json).DistrictID : null;
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$'+clientDistrict);
    for(var x = 1; x <= Object.keys(option_numbers).length; x++){
        try{
            var opt_row = menu_table.queryRows({'vars': {'option_number': x}}).next();
            if(opt_row.vars.option_name == 'view_group_repayment' && !state.vars.isGroupLeader) {
                x++;
                opt_row = menu_table.queryRows({'vars': {'option_number': x}}).next();
            }
            if(clientDistrict && (opt_row.vars.option_name == 'enr_order_start' || opt_row.vars.option_name == 'enr_order_review_start') && isDistrictClosed(clientDistrict)) {
                continue;
            }
            var temp_out = output + String(x) + ')' + opt_row.vars[lang] + '\n';
            if(temp_out.length < max_chars){
                output = output + String(x) + ')' + opt_row.vars[lang] + '\n';
            }
            else{
                out_obj[loc] = output + next_page;
                output = prev_page + '\n' + String(x) + ')' + opt_row.vars[lang] + '\n';
                loc = loc + 1;
            }
            console_output = console_output + String(x) + ')' + opt_row.vars[console_lang] + '\n';
        }
        catch(error){
            admin_alert('Options table length does not match option labeling\nError: ' + error+'\ntable : ' + table_name);
            break;
        }
    }

    // Append menu of  group repayments if group leaders
    if(Object.keys(out_obj).length > 0){
        out_obj[loc] = out_obj[loc] = output;
        return out_obj;
    }
    else{
        return output;
    }
};


function isDistrictClosed(districtId) {
    var table = project.initDataTableById(service.vars.endEnrollmentTableId);
    var cursor = table.queryRows({vars: {'district_id': districtId}});
    console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
    if(cursor.hasNext()) {
        console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& hasNext');
        row = cursor.next();
        if(Date.parse(new Date((row.vars.date_time))) < Date.parse(Date.now())) {
            console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& satisfy');
            return true;
        }
    }
    return false;
}
