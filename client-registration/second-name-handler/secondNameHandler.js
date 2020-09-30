
var handlerName = 'second_name_handler';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onSecondNameReceived){
        return function (input) {
            input = input.replace(/[^a-zA-Z]/gi, '');
            onSecondNameReceived(input);
        };
    }
};