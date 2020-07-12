

module.exports = function(chicken_table, acc_nber, client_json){

    //client_json =JSON.parse(client_json);
    //calculate the prepayment
    var prepayment_amount = client_json.BalanceHistory.TotalRepayment_IncludingOverpayments - client_json.BalanceHistory.TotalCredit;
    prepayment_amount = 8000;
    // if prepayment satisfies the mminimum condition( > than 2 chicken prepayment amount(2000))
    if(prepayment_amount >= 1000){
        state.vars.minimum_amount_paid = true;
        // If the prepayment is greater than the maximum number of chicken necessary(15) 
        if((prepayment_amount / 500) > 15){
            state.vars.max_chicken = 15;
        }
        // else calculate the client's possible maximum
        else{
            state.vars.max_chicken = prepayment_amount / 500;
        }
    }
    //doesn't satify the minimum amount
    else{
        state.vars.minimum_amount_paid = false;
    }
    var cursor = chicken_table.queryRows({'vars': {'account_number': acc_nber}});

    if(cursor.hasNext()){
        var row = cursor.next();
        state.vars.chcken_nber = row.vars.ordered_chickens || 0;
        state.vars.farmer_name  = JSON.parse(state.vars.client_json).FirstName;
        //Did not roder any chicken return
        if(state.vars.chcken_nber == 0){
            return;
        } 
        else{
            // If the client confirmed and just want to check
            if(row.vars.confirmed == 1){
                state.vars.confirmed_chicken = true;
                return;
            }
            // If the client did not confirm or wants to change
            else{
                // Client did not confirm
                if(row.vars.chicken_confirmed != 1){
                    state.vars.confirmed_chicken = false;
                }

            }
        } 
    }
    else{
        state.vars.client_notfound = true;
        //admin_alert = require('./admin-alert')
        //admin_alert('Client account not fund in chicken table + '\n' + JSON.stringify(client));
    }  

};