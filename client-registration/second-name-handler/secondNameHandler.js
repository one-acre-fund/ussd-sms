
var handlerName = 'second_name_handler';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onSecondNameReceived){
        return function (input) {
            input = input.replace(/[^a-zA-Z0-9]/gi, '');
            if (state.vars.country == 'RW' && !input) {
                input = 'XXXXXXX';
            }
            onSecondNameReceived(input);
        };
    }
};
