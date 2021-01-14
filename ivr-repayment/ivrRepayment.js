var validateClient = require('./validateClient');
var triggerPayment = require('../shared/rosterApi/rosterColRequest');

module.exports = function(phoneNumber, paymentAmount, accountNumber) {
    var defaultEnvironment;
    if(service.active){
        defaultEnvironment = 'prod';
    }else{
        defaultEnvironment = 'dev';
    }

    var env;
    if(service.vars.env === 'prod' || service.vars.env === 'dev'){
        env = service.vars.env;
    }else{
        env = defaultEnvironment;
    }


    service.vars.server_name = project.vars[env + '_server_name'];
    service.vars.roster_read_key =  project.vars[env + '_roster_read_key'];
    var client = validateClient(accountNumber);
    if(client) {
        var paymentTriggered = triggerPayment(accountNumber, paymentAmount, phoneNumber);
        if(paymentTriggered) {
            return true;
        }
        return false;
    }
    return false;
};
