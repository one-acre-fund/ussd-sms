var handlerName = 'transaction_select_handler';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onTransactionSelected){
        return function (input) {
            onTransactionSelected(input);
        };
    }
};