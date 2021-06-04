/*
function for populating a USSD menu
takes as input a table + a lang
tables accessed by this function should have a field for each lang, plus an 'option_number' and 'option_name' field
option number is the numbered option that will apear in the menu
option name is the name of the response handler that will handle the selected option
*/
var bundles = require('../dat/district-bundles');
var msgs = require('./msg-retrieve'); 

//var bundles = getBundles();

function countOptions(){
    var count ={};
    bundles.forEach(function(bundle){
        count[bundle.option_number] = 1 + (count[bundle.option_number] || 0);
    });
    return count;
}

module.exports = function( lang, max_chars){
    lang = lang || project.vars.lang;
    var console_lang = project.vars.console_lang;
    var prev_page = msgs('prev_page',{},lang);
    var next_page = msgs('next_page',{},lang);
    console.log(prev_page+'****************'+ next_page);
    
    if(prev_page == null || next_page == null){
        lang = 'ki';
        console_lang = 'en';
        var admin_alert = require('./admin-alert');
        console.log('error');
        admin_alert('Language not found\nError: ');
    } 
    max_chars = max_chars || 120;
    var output = '';
    var console_output = '';
    var option_numbers = countOptions();

    var out_obj = {};
    var loc = 0;
    for(var x = 1; x <= Object.keys(option_numbers).length; x++){
        
        try{
            var row = bundles.shift(); // old implementation was (.filter(function (r) { return r.option_number === x;})[0]) which omited bundles with option_number > loop count (x)
            if(row && row['d'+state.vars.client_districtId] == 1){
                var temp_out = output + row['option_number']+ ')' + row[lang] + '\n';
                if(temp_out.length < max_chars){
                    output = output + row['option_number']+ ')' + row[lang] + '\n';
                }
                else{
                    out_obj[loc] = output + next_page;
                    output = prev_page + '\n' + row['option_number'] + ')' + row[lang] + '\n';
                    loc = loc + 1;
                }
                console_output = console_output + row['option_number'] + ')' + row[console_lang] + '\n';
            }
        }
        catch(error){
            admin_alert = require('./admin-alert');
            admin_alert('Options table length does not match option labeling\nError: ' + error);
            break;
        }
    }
    console.log('output: ' + JSON.stringify({data: out_obj}) + 'lang: ' + lang);
    if(Object.keys(out_obj).length > 0){
        out_obj[loc] = out_obj[loc] = output;
        console.log('output obje: ' + JSON.stringify({obje: out_obj}));
        return out_obj;
    }
    else{
        console.log('output only: ' + JSON.stringify({output: output}));
        return output;
    }
};
