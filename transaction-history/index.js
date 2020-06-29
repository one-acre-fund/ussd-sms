
var idVerificationHandler = require('./id-verification/index');

module.exports = {
    start: function () {
        addInputHandler('last_four_nid_handler', idVerificationHandler);
        promptDigits('last_four_nid_handler');
        
    }
};