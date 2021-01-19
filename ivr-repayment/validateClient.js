var rosterAPI = require('../rw-legacy/lib/roster/api');
var getClient = require('../shared/rosterApi/getClient');

module.exports = function validateClient(AccNum) {
    // validate the client
    var clientExist = rosterAPI.authClient(AccNum,'KE');
    if(clientExist) {
        return getClient(AccNum, 'KE');
    }
    return false;
};
