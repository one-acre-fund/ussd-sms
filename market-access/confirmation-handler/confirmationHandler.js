var handlerName = 'ConfirmationHandler';

module.exports = {
    handlerName: handlerName,
    getHandler: function (onConfirmation){
        return function(input){
            if(input == '0'){
                onConfirmation(true);
            }
            else{
                onConfirmation(false);
            }
        };

    }
};