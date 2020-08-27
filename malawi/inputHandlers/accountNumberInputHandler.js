var getClient = require('../utils/getClient');
var buybackTransactions =  require('../../buyback-transactions/buyBackTransactions');

module.exports = function(input){
    var account_number = input.replace(/\D/g, '');

    var client = getClient(account_number);
    if(client.error_message){
        sayText(client.error_message);
        promptDigits('account_number', {
            'submitOnHash': false,
            'maxDigits': 8,
            'timeout': 10,
        });
    } else {
        // spin the buyback implementation
        state.vars.client = JSON.stringify(client.client);
        buybackTransactions.start();
    } 
};
