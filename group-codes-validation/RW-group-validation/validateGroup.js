var groupCodes = require('./groupCodes');
module.exports = function (groupCode){
    if(groupCodes[groupCode]){
        return true;
    }
    return false;
};