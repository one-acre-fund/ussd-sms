var handlerName = 'account_number_handler';
module.exports = {
    handlerName: handlerName,
    getHandler: function(onAccountNumberValidated){
        return function (input) {
            notifyELK();
            if(isInTheSameGroup(input)){
                onAccountNumberValidated(input);
            }
            else{
                global.sayText(translate('account_number_handler'));
                global.promptDigits(handlerName);
            }

        };
    }
};