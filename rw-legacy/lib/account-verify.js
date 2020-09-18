/*
main function for interacting with Roster API and retrieving client JSONs
*/
function reduceSize(client) {
    var cloned = _.clone(client);
    cloned.AccountHistory = client.AccountHistory.slice(0,3);
    cloned.BalanceHistory = client.BalanceHistory.slice(0,3);
    return cloned;
}

module.exports = function(account_number){
    console.log('###verifying Account Number: '+account_number);
    
    var client = null;
    var api = require('./roster/api'); //roster. occasionally will need update
    api.loadURLAndAPIKey();
    var country = project.vars.country;
    api.verbose = true;
    api.loadURLAndAPIKey(); //todo: make more general
    try{
        var client_auth = api.authClient(account_number, country);
        if(client_auth){
            client = api.getClient(account_number);
            try {
                state.vars.client_json = JSON.stringify(client);                
            } catch (error) {
                state.vars.client_json = JSON.stringify(reduceSize(client));
            }
            console.log('####clientJSON: '+JSON.stringify(client));
            
            state.vars.client_name = client.ClientName;
            state.vars.client_district = client.DistrictName;
            state.vars.client_districtId = client.DistrictId;
            state.vars.client_site = client.SiteName;
            state.vars.client_id = client.ClientId;
            state.vars.client_SiteId = client.SiteId;
            console.log('name: ' + state.vars.client_name);
            console.log('district: ' + state.vars.client_district);
            console.log('site: ' + state.vars.client_site);
            return true;
        }
        else{
            return false;
        }
    }
    catch(error){
        var Log  = require('../../logger/elk/elk-logger');
        var logger = new Log();
        var errorMessage = 'API failure on account number ' + account_number;
        logger.error(errorMessage, {
            data: {
                account_number: account_number,
                error: error,
                client: client
            }
        });
        return false;
    }
};
