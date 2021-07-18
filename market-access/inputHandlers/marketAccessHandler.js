var handlerName = 'mkt_access_menu_handler';

module.exports = {
    handlerName: handlerName,
    getHandler: function(onMarketAccessOptionChosen){
        return function(input) {
            return onMarketAccessOptionChosen(input);
        };
    }
};