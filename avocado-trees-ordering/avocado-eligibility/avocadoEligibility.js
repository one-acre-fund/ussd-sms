
module.exports = function(table, acc_nber, client_json){

    var avocadoCursor = table.queryRows({'vars': {'account_number': acc_nber}});
    var prepRequired,numberOfTreesPossible, orderedAvocado  = 0;
    if(avocadoCursor.hasNext()){
        var row = avocadoCursor.next();
        prepRequired = row.vars.prepay;
        orderedAvocado = row.vars.a_avokaqty;
    }
    else{
        //check if it's a new client
        //var acoda
        //display client not found
        var new_client_table = project.initDataTableById(service.vars.rw_reg_client_table_id);
        var cursor = new_client_table.queryRows({'vars': {'account_number': acc_nber}});
        if(cursor.hasNext()){
            return { 
                possibleTrees: 50,
                balance: 0,
                orderedAvocado: 0
            };

        }
        else{
            return false;

        }
        
    }
    // Get the last season's balance
    if(client_json.BalanceHistory.length > 0){
        client_json.BalanceHistory = client_json.BalanceHistory[0];
    }
    var prepayment_amount = client_json.BalanceHistory.TotalRepayment_IncludingOverpayments - prepRequired;

    if(orderedAvocado == 0){
        numberOfTreesPossible = prepayment_amount / 500;
    }
    else if(orderedAvocado < 10){
        numberOfTreesPossible = (prepayment_amount - 1000) / 500;
    }
    else if(orderedAvocado >= 10){
        numberOfTreesPossible = (prepayment_amount - 1500) / 500;
    }
    
    return { 
        possibleTrees: numberOfTreesPossible,
        balance: prepayment_amount,
        orderedAvocado: orderedAvocado
    };
    
};
