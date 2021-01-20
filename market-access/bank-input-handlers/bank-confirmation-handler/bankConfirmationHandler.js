var handlerName = 'bankConfirmationHandler';

module.exports = {
    handlerName: handlerName,
    getHandler: function (onBankConfirmed){
        return function(input){
            if(input == '0'){
                onBankConfirmed(true);
            }
            else{
                onBankConfirmed(false);
            }
        };

    }
};