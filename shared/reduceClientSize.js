module.exports = function reduceClientSize(client) {
    var cloned = _.clone(client);
    cloned.AccountHistory = client.AccountHistory.slice(0,3);
    cloned.BalanceHistory = client.BalanceHistory.slice(0,3);
    return cloned;
};
