/**
 * Returns the client information
 * @param {String} accountNumber this is the registered account number of the user
 * @param {String} country
 */
module.exports = function getClient(accountNumber, country) {
    var fullUrl = service.vars.server_name + '/api/sms/Client?' + 'account=' + accountNumber + '&country=' + country;
    var opts = { headers: {} };
    opts.headers['Authorization'] = 'Token ' + service.vars.roster_read_key;
    opts.method = 'GET';
    try {
        var response = httpClient.request(fullUrl, opts);
        if (response.status == 200) {
            var data = JSON.parse(response.content);
            return data;
        }
        else {
            console.log('Error while fetching client information');
            console.log(JSON.stringify(response));
        }
    } catch (error) {
        console.log('Error: ' + error);
    }
};
