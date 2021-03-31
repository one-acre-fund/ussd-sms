/*
    Function: registration_check.js
    Purpose: allows a client to register their SHS product
    Status: complete
*/

module.exports = function(accnum){
    // load relevant functions and data tables
    var admin_alert = require('./admin-alert');
    var slack = require('../../slack-logger/index');
    var table = project.getOrCreateDataTable(service.vars.serial_number_table);
    state.vars.duplicate = false; 

    // retrieve rows where account number in table corresponds to input account number
    var ListRows = table.queryRows({
        vars: {'accountnumber': accnum} 
    });

    // get unlock code if client has paid up; else get the latest activation code
    console.log('ListRows count is ' + ListRows.count());
    if(ListRows.count() === 1){
        var Serial = ListRows.next();
        state.vars.serial_no = Serial.vars.serialnumber;
        var Activationtable = project.getOrCreateDataTable(service.vars.activation_code_table);
        // if the serial number is unlocked, retrieve the the relevant activation code
        if (Serial.vars.unlock == 'Yes'){
            console.log('unlock is:' + Serial.vars.unlock);
            state.vars.unlock = true;
            var unlockVars = {
                'activated': 'Yes',
                'unlock': 'Yes',
                'serialnumber': state.vars.serial_no,
            };
            /// removing the product type since we are currently not checking for it as we are selling biolite only
            // If the the product type is not null check if it is biolite
            // if(Serial.vars.product_type != null){
            //     unlockVars['product_type'] = {'ne': 'biolite'};
            //     // If the product type is biolite in the serial table, look for not only a serial that match product type is biolite 
            //     if(Serial.vars.product_type == 'biolite'){
            //         unlockVars['product_type'] = 'biolite';
            //     }
            // }
            console.log('unlock vars ' + JSON.stringify(unlockVars));
            var ActList = Activationtable.queryRows({
                vars: unlockVars,
            });
            
            // if the serial number is in the table, retrieve the corresponding activation code; else send alert to admin
            if(ActList.count() >= 1){
                var Act = ActList.next();
                state.vars.ActCode = Act.vars.code;
                return true;
            }
            else{
                admin_alert('No rows in ActTable for serial no: ' + state.vars.serial_no, 'Missing Serial Number in ActivationCodes', 'marisa');
                slack.log('No rows in ActTable for serial no: ' + state.vars.serial_no, 'Missing Serial Number in ActivationCodes');
                console.log('No rows in ActTable for serial no: ' + state.vars.serial_no, 'Missing Serial Number in ActivationCodes');
                return false;
            }
        }
        else{
            console.log('About to get the latest activation code');
            // Get latest activation code
            state.vars.unlock = false;
            var activationVars= {
                'activated': 'Yes',
                'serialnumber': state.vars.serial_no,
            };
            console.log(JSON.stringify(activationVars));
            ActList = Activationtable.queryRows({
                vars: activationVars,
            });
            if(ActList.count() == 0){ 
                Serial.vars.accountnumber = null;
                Serial.vars.dateregistered = null;
                Serial.vars.historic_credit = null;
                Serial.save();
                admin_alert('No rows in ActTable for serial no: ' + state.vars.serial_no, 'Missing Serial Number in ActivationCodes', 'marisa');
                slack.log('No rows in ActTable for serial no: ' + state.vars.serial_no, 'Missing Serial Number in ActivationCodes');
                console.log('No rows in ActTable for serial no: ' + state.vars.serial_no, 'Missing Serial Number in ActivationCodes');
                return false;
            }
            // save the client's number of codes used
            Serial.vars.numbercodes = ActList.count();
            Serial.save();
            
            // 
            var LatestDateActivated = '';
            while(ActList.hasNext()){
                var Act = ActList.next();
                var current_date = new Date(Act.vars.dateactivated);
                if(current_date > LatestDateActivated){
                    LatestDateActivated = current_date;
                    state.vars.ActCode = Act.vars.code;
                }
            }
            return true;
        }
    }
    // if there are multiple serial numbers assigned to the same account, the client may have multiple products
    else if(ListRows.count() > 1){
        state.vars.duplicate = true;
        return false;
    }
    else{
        console.log('Client has not yet registered.');
        return false;
    }
};
