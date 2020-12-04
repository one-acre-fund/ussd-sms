var handlerName = 'jit_topup_order_more_handler';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onOrderMore) {
        return function(input) {
            if(input == 1) {
                onOrderMore();
            } else {
                global.stopRules();
            }
        };
    }
};
