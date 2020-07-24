
var handlerName = 'first_name_handler';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onFirstNameReceived){
        return function (input) {
            onFirstNameReceived(input);
        };
    }
};