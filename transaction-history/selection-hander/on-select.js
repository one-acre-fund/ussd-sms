var handlerName = 'on-transaction-list-selection';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onTransactionSelected){
        return function (input) {
            onTransactionSelected(input);
        };
    }
};