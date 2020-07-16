
var handlerName = 'second_name_handler';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onSecondNameReceived){
        return function (input) {
            onSecondNameReceived(input);
        };
    }
};