/*
module to generate order review string from client row and input menu string
*/

// load in different modules
var account_verify = require('./account-verify');

// save options for calculating prepayment
const repayment_calc_options = {
    'inputTable21A'   : rgo_prepayment_calc,
    'default'           : core_prepayment_calc
};

// calculate prepayment based on Ruhango rules
function rgo_prepayment_calc(client, input_menu_name){
    // assign clients to a prepayment calculation option, with default as non-20a
    state.vars.prev_client = false;
    var new_client = client.vars.new_client;
    // clients use the prev_client calc if their last season credit is positive and they didn't overpay
    if(new_client == null || new_client == undefined){
        account_verify(client.vars.account_number);
        var client_object = JSON.parse(state.vars.client_json);
        const arrayLength = client_object.BalanceHistory.length;
        // calculate balance and credit for returning clients
        if(arrayLength > 1){
            const index = arrayLength - 1;
            var balance = client_object.BalanceHistory[index].Balance;
            var credit = client_object.BalanceHistory[index].TotalCredit;
            if(credit > 0){
                state.vars.prev_client = true;
            }
        }
    }
    if(state.vars.prev_client){ // returning client remainder: 60% of 20A total credit eligibility
        const req_perc = 0.6;
        var perc_repaid = (credit - balance) / credit;
        var remainder = (req_perc - perc_repaid) * credit;
        if(remainder < 0){
            remainder = 0;
        }
        return remainder;
    }
    else{ // prepayment: 30% of 20B tx size
        var input_table = project.getOrCreateDataTable(input_menu_name);
        var percent = .3; 
        var products = input_table.countRowsByValue('bundle_name');
        var price = 0;
        for(prod in products){
            var prod_row = input_table.queryRows({'vars' : {'bundle_name' : prod}}).next();
            if(parseFloat(client.vars[prod_row.vars.bundle_name]) > 0){
                if(prod == 'shs_20a'){
                    price += 18625; //using this because our prices arent consistent!!
                }
                else if(prod == 'maize'){ // for ruhango only; don't know maize variety generally
                    price += 1000;
                }
                else{
                    price += parseFloat(client.vars[prod_row.vars.bundle_name]) * parseFloat(prod_row.vars.price);
                }
            }
        }
        console.log('Left the product for loop');
        var prepayment = price * percent;
        return prepayment;
    }
}

function core_prepayment_calc(client_row, input_menu_name){
    console.log('trying core prep calc on : ' + client_row + ' ' + input_menu_name);
    throw 'Passing on prepayment for the moment here';
}

module.exports = function(account_number, input_menu_name, current_orders, an_table, lang, max_chars){ //here there be tygers
    var get_client = require('./enr-retrieve-client-row');
    var client = get_client(account_number, an_table);
    max_chars = max_chars || 130;
    var input_table = project.getOrCreateDataTable(input_menu_name);
    var products = input_table.countRowsByValue('bundle_name');
    var msgs = require('./msg-retrieve');
    var next_page = msgs('next_page',{},lang);
    var prev_page = msgs('prev_page',{},lang);
    var pre_str = ''
    try{
        var prepayment = repayment_calc_options[input_menu_name](client, input_menu_name);
        if(state.vars.prev_client){
            pre_str = msgs('enr_repayment_alert', {'$REMAINDER' : prepayment}, lang) || ' ';
        }
        else{
            pre_str = msgs('enr_prepayment', {'$PREP' : prepayment}, lang) || ' ';
        }
    }
    catch(err){
        console.log(err);
        pre_str = '';
    }
    var name_str = client.vars.name1 + ' ' + client.vars.name2;
    var client_name = state.vars.client_name || name_str;
    var outstr = client_name + ' ' + pre_str +'\n';
    var outobj = {}
    var loc = 0;
    var hasNoOrder = true;
    var currentOrders = current_orders ? JSON.parse(current_orders) : [];
    for(prod in products){
        var prod_row = input_table.queryRows({'vars' : {'bundle_name' : prod}}).next();
        var bundle_name = prod_row.vars['bundle_name'].replace(/ /g,"_");

        var bundleQuantityStr = '';
        var bundleQuantity = 0;
        if (currentOrders[bundle_name]) {
            bundleQuantity = parseFloat(currentOrders[bundle_name].quantity);
            bundleQuantityStr = currentOrders[bundle_name].quantity;
        } else {
            bundleQuantityStr = client.vars[bundle_name];
            bundleQuantity = parseFloat(client.vars[bundle_name]);
        }

        if(bundleQuantity > 0){
            hasNoOrder = false;
            var prodPrice = parseFloat(prod_row.vars.price);
            var tempstr = prod_row.vars[lang]+':'+bundleQuantityStr+' ' +prod_row.vars.unit+' - '+(bundleQuantity * prodPrice)+'RWF';
            var currentMenu = outstr + tempstr  + '\n';
            if(currentMenu.length < max_chars){
                outstr =  outstr + tempstr  + '\n';
            }
            else{
                outobj[loc] = outstr +'\n'+ next_page;
                outstr = prev_page + '\n' + tempstr;
                loc = loc + 1;
            }
        }
    }
    if(hasNoOrder){
        return null;
    }
    var end_review_msg = msgs('end_review_msg',{},lang);
    if(Object.keys(outobj).length > 0){
        if(((outstr + '\n' + end_review_msg).length) > max_chars){
            outobj[loc] = outstr + '\n' + next_page;
            loc = loc + 1;
            outobj[loc] = prev_page +'\n'+ end_review_msg;
        }
        else{
            outobj[loc] = outstr + '\n' + end_review_msg;
        }
        return outobj;
    }
    else if(outstr.length > 0){
        if((outstr + '\n'+ end_review_msg).length > max_chars){
            outobj[loc] = outstr + '\n' + next_page;
            loc = loc + 1;
            outobj[loc] = prev_page +'\n'+ end_review_msg;
            return outobj;
        }
        else{
            return outstr + '\n' + end_review_msg;
        }
    }
};
