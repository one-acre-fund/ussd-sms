/*
    Function: serial_no_check.js
    Purpose: checks if the input SHS serial number is in our data
    Status: complete
*/


module.exports = function(accnum, serial_no){
    // retrieve necssary tables and modules
    var admin_alert = require('./admin-alert');
    var slack = require('../../slack-logger/index');
    var SerialTable =  project.getOrCreateDataTable(service.vars.serial_number_table);
    var ListRows = {};
    // save as variable the row from the serial table where the entered serial number matches
    ListRows = SerialTable.queryRows({
        vars: {'serialnumber': serial_no, 'accountnumber': {exists: 0}}
    });

    // if there's a row in serial table with the serial number and no account number, assign the account to that serial
    if(ListRows.count() === 1){
        var Serial = ListRows.next();
        // assign account to serial number
        state.vars.SerialStatus = 'Reg';
        Serial.vars.accountnumber = accnum; 
        Serial.vars.historic_credit = state.vars.TotalCredit - state.vars.Balance;
        Serial.vars.dateregistered = new Date().toString();
        if(!state.vars.duplicate){Serial.vars.product_type = 'biolite';}
        Serial.save(); 
        
        // retrieve one unused activation code for this serial number
        var ActTable = project.getOrCreateDataTable(service.vars.activation_code_table);
        var listVars = {'serialnumber': serial_no,
            'type': 'Activation',
        };
        // if(!state.vars.duplicate){listVars.vars.product_type = 'biolite';} // because only biolite products are being sold now

        var ListAct = ActTable.queryRows({
            vars: listVars,
        });

        var Act = null;
        if(ListAct.hasNext()) {
            var row = ListAct.next();
            if(row.vars.activated !== 'Yes') {
                Act = row;
            }
        }
        if(Act === null){
            admin_alert('No codes remaining for Biolite product with serial number: ' + serial_no, 'No remaining serial numbers', 'marisa');
            slack.log('No codes remaining for Biolite product with serial number: ' + serial_no);
            console.log('No codes remaining for Biolite product with serial number: ' + serial_no, 'No remaining serial numbers');            
            state.vars.SerialStatus = 'failed_getting_serial_number';
        }
        else{
            state.vars.ActCode = Act.vars.code;
            Act.vars.activated = 'Yes';
            Act.vars.dateactivated = new Date().toString();
            Act.save();
        }
        // update the activation table to say that this code has been used
    }
    // if there are more than one rows with the input serial number, flag an error
    else if(ListRows.count() > 1){
        admin_alert('duplicate serial numbers in PSHOPs database sn: ' + serial_no, 'Duplicate Serial Numbers in TR DB', 'marisa');
        slack.log('duplicate serial numbers in PSHOPs database sn: ' + serial_no);
        console.log('duplicate serial numbers in PSHOPs database sn: ' + serial_no, 'Duplicate Serial Numbers in TR DB');
        return false;
    }
    // if there are zero rows in the table with the serial number, return false
    else{
        state.vars.SerialStatus = 'NotFound';
        return false;
    }
};
